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
		throw Error("Cue command mapping failed: NodeCG handle is invalid.");
	}
	const nodecg = nodecgHandle.current;
	const cuemap : SoundCommandList = [];
	const soundCues = nodecg.readReplicant<CueAssets>(SoundAlertReplicants.nodeCGServerSoundCues);
	const cueIndex = nodecg.Replicant<number>(SoundAlertReplicants.soundCueCommandIndex);

	if (soundCues && soundCues.length > 0) {
		for (let c = 0; c < soundCues.length; c++) {
			let cue = soundCues[c];
			cuemap.push({
				id: ++cueIndex.value,
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

module.exports = function (nodecg : NodeCG) {
	nodecg.log.debug('Soundalerts bundle started.');
	nodecgHandle.current = nodecg;

	// create replicants if they don't exist
	nodecg.Replicant<number>(SoundAlertReplicants.soundCueCommandIndex, { defaultValue: 0 });
	nodecg.Replicant<boolean>(SoundAlertReplicants.soundCuesEnabled, { defaultValue: false });
	nodecg.Replicant<AudioAlertLog>(SoundAlertReplicants.soundCueLog, { defaultValue: {} });
	nodecg.Replicant<string[]>(SoundAlertReplicants.soundCueTypes, {
		defaultValue: [ 
			SoundCommandType.ordered, 
			SoundCommandType.random, 
			SoundCommandType.single 
		]
	});

	// set up sound cues if not intialized
	const soundCueMap = nodecg.Replicant<SoundCommandList>(SoundAlertReplicants.soundCueConfig);
	// if (!soundCueMap.value || soundCueMap.value.length === 0) {
		soundCueMap.value = getDefaultCueMap();
	// }

	const knownSoundCues = nodecg.Replicant<SoundCueNameList>(SoundAlertReplicants.soundCueList, { defaultValue: [] });	
	// refresh list of known sound cues when the cue replicant changes
	nodecg.Replicant<CueAssets>(SoundAlertReplicants.nodeCGServerSoundCues)
		.on(ReplicantEvents.change, (newVal) => {
			knownSoundCues.value = newVal.map((c) => c.name);
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
