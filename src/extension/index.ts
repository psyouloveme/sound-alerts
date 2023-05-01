import { NodeCG } from "nodecg-types/types/server";
import nodecgHandle from "./NodeCGHandle";
import { deleteSoundCommand, upsertSoundCommand } from "./ConfigListeners";
import { twitchChatReceived } from "./ChatListeners";
import { SoundAlertReplicants, SoundCueNameList } from "../types/SoundAlertReplicants.d";
import SoundCommandType from "../types/SoundCommandType.d";
import SoundCommandEvents from "../types/SoundCommandEvents.d";
import ReplicantEvents from "../types/ReplicantEvents.d";
import { playedSoundCue } from "./EventListeners";

enum BundleDeps {
	twitchListener = "twitch-listener"
};

function getDefaultCueMap() {
	if (!nodecgHandle.current) {
		throw Error("Cue command change failed: NodeCG handle is invalid.");
	}
	const nodecg = nodecgHandle.current;
	const cuemap : SoundCommandList = [];
	const soundCues = nodecg.readReplicant<CueAssets>(SoundAlertReplicants.nodeCGServerSoundCues);
	if (soundCues && soundCues.length > 0) {
		for (let c = 0; c < soundCues.length; c++) {
			let cue = soundCues[c];
			cuemap.push({
				commandName: cue.name.startsWith("!") ? cue.name : `!${cue.name}`,
				enabled: false,
				coolDownMs: null,
				lastUseTimestamp: null,
				allCuesAreValid: true,
				mappedCues: [cue.name],
				orderedMappingIndex: null,
				commandType: SoundCommandType.single,
				commandUsageCount: 0
			})
		}
	}
	return cuemap;
}

function initCueTypes() {
	return [ SoundCommandType.ordered, SoundCommandType.random, SoundCommandType.single ];
}

module.exports = function (nodecg : NodeCG) {
	nodecg.log.debug('Soundalerts bundle started.');
	nodecgHandle.current = nodecg;

	// create replicants if they don't exist
	nodecg.Replicant<boolean>(SoundAlertReplicants.soundCuesEnabled, { defaultValue: false });
	nodecg.Replicant<AudioAlertLog>(SoundAlertReplicants.soundCueLog, { defaultValue: {} });
	
	const soundCueTypes = nodecg.Replicant<string[]>(SoundAlertReplicants.soundCueTypes);
	if (!soundCueTypes.value) {
		soundCueTypes.value = initCueTypes();
	}

	// set up sound cues if not intialized
	const soundCueMap = nodecg.Replicant<SoundCommandList>(SoundAlertReplicants.soundCueConfig);
	// if (!soundCueMap.value || soundCueMap.value.length === 0) {
		soundCueMap.value = getDefaultCueMap();
	// }

	// refresh list of known sound cues when the cue replicant changes
	const knownSoundCues = nodecg.Replicant<SoundCueNameList>(SoundAlertReplicants.soundCueList, { defaultValue: [] });
	
	nodecg.Replicant<CueAssets>(SoundAlertReplicants.nodeCGServerSoundCues)
		.on(ReplicantEvents.change, (newVal) => {
			knownSoundCues.value = newVal.map((c) => c.name);;
		});

	// refresh status of mapped cues when known cue list changes
	knownSoundCues.on(ReplicantEvents.change, (newVal) => {
		soundCueMap.value.forEach((c) => {
			c.allCuesAreValid = c.mappedCues.every((mc) => newVal.includes(mc))
		})
	});

	// bind event listeners
	nodecg.listenFor(SoundCommandEvents.upsertSoundCommand, upsertSoundCommand);
	nodecg.listenFor(SoundCommandEvents.deleteSoundCommand, deleteSoundCommand);
	nodecg.listenFor(SoundCommandEvents.playedSoundCue, playedSoundCue);
	nodecg.listenFor(SoundCommandEvents.twitchChatReceived, BundleDeps.twitchListener, twitchChatReceived);
};
