import { NodeCG } from "nodecg-types/types/server";

function onChatReceived({ user = "", message = "" }) {
	if (!user || !message || !message.startsWith("!")) {
	  return;
	}

	const splitAlert = message.split(" ")[0];
	if (splitAlert && nodecg.findCue(splitAlert)) {
	  nodecg.playSound(splitAlert);
	  nodecg.sendMessage("played-cue", splitAlert);
	}
};

function getDefaultCueMap(nodecg: NodeCG) {
	const cuemap : SoundCueMapList = [];
	const soundCues = nodecg.readReplicant<CueAssets>("soundCues");
	if (soundCues && soundCues.length > 0) {
		for (let c = 0; c < soundCues.length; c++) {
			let cue = soundCues[c];
			cuemap.push({
				commandName: `!${cue.name}`,
				coolDownMs: null,
				lastUseTimestamp: null,
				allCuesAreValid: true,
				mappedCues: [cue.name],
				orderedMappingIndex: null,
				mapType: SoundCueMapType.single,
				commandUsageCount: 0
			})
		}
	}
	return cuemap;
}


module.exports = function (nodecg : NodeCG) {
	nodecg.log.debug('Soundalerts bundle started.');
	const audioAlertsEnabled = nodecg.Replicant<boolean>('audio_alerts_enabled', {
		defaultValue: false
	});
	const audioAlertLog = nodecg.Replicant<AudioAlertLog>('audio-alert-log', {
		defaultValue: {}
	});

	const soundCueMap = nodecg.Replicant<SoundCueMapList>("sound_command_config");
	if (!soundCueMap.value || soundCueMap.value.length === 0) {
		soundCueMap.value = getDefaultCueMap(nodecg);
	}

	// refresh list of known sound cues when the cue replicant changes
	const knownSoundCues = nodecg.Replicant<string[]>("known_sound_cues", { defaultValue: [] });
	nodecg.Replicant<CueAssets>("soundCues").on("change", (newVal) => {
		const nextKnownCues = [];
		for (let i = 0; i < newVal.length; i++) {
			nextKnownCues.push(newVal[i].name);
		}
		knownSoundCues.value = nextKnownCues;
	});

	// refresh status of mapped cues when known cue list changes
	knownSoundCues.on("change", (newVal) => {
		soundCueMap.value.forEach((c) => {
			c.allCuesAreValid = c.mappedCues.every((mc) => newVal.includes(mc))
		})
	});

	nodecg.listenFor("ChangeCueMap", (newCue: CueMapChange, ack) => {
		if (!newCue.commandName && ack && !ack.handled) {
			ack(Error(`Cue command change failed: No cue command name was provided.`));
			return;
		}
		if ((!newCue.mappedCues || newCue.mappedCues.length === 0) && ack && !ack.handled) {
			ack(Error(`Cue command change failed: No cues were mapped to command ${newCue.commandName}.`));
			return;
		} 

		nodecg.log.debug("changing cue command: %s", newCue.commandName);
		let idx = soundCueMap.value.findIndex((c) => c.commandName === newCue.commandName);
		if (idx < 0)  {
			soundCueMap.value.push({
				commandName: newCue.commandName,
				coolDownMs: newCue.coolDownMs,
				mapType: newCue.mapType,
				orderedMappingIndex: newCue.mapType === SoundCueMapType.ordered ? 0 : null,
				commandUsageCount: 0,
				lastUseTimestamp: null,
				allCuesAreValid: newCue.mappedCues.every((mc) => knownSoundCues.value.includes(mc)),
				mappedCues: [ ...newCue.mappedCues, ]
			});
		} else {
			let oldCue = soundCueMap.value[idx];
			let nextCue = {
				...oldCue,
				coolDownMs: newCue.coolDownMs,
				orderedMappingIndex: newCue.mapType === SoundCueMapType.ordered ? 0 : null,
				mapType: newCue.mapType,
				allCuesAreValid: newCue.mappedCues.every((mc) => knownSoundCues.value.includes(mc)),
				mappedCues: [ ...newCue.mappedCues, ]
			};
			soundCueMap.value[idx] = nextCue;
		}
	})

	nodecg.listenFor("DeleteCueMap", (commandName: string, ack) => {
		nodecg.log.debug("deleting cue command: %s", commandName);
		if (!commandName && ack && !ack.handled) {
			ack(Error(`Cue command delete failed: No cue command name was provided.`));
			return;
		}
		let idx = soundCueMap.value.findIndex((c) => c.commandName === commandName);
		if (idx < 0 && ack && !ack.handled) {
			ack(Error(`Cue command delete failed: No cue command ${commandName} was found.`));
			return;
		}
		soundCueMap.value = soundCueMap.value.splice(idx, 1);
	})


	
	
	nodecg.listenFor("ChatReceived", "twitch-listener", ({ user = "", message = "" }) => {
		if (!user || !message) {
		  return;
		}
		const splitAlert = message.split(" ")[0];
		let idx = soundCueMap.value.findIndex((c) => c.commandName === splitAlert);
		if (idx < 0) {
			return;
		}
		const cmd = soundCueMap.value[idx];
		if (!cmd.allCuesAreValid) {
			nodecg.log.warn(`Cue command ${splitAlert} has invalid cues, not playing.`);
			return;
		}
		if (cmd.coolDownMs && cmd.lastUseTimestamp && (Date.now() - cmd.lastUseTimestamp) < cmd.coolDownMs) {
			nodecg.log.warn(`Cue command ${splitAlert} is still on cooldown, not playing.`);
			return;
		}
		if (!cmd.mappedCues || cmd.mappedCues.length === 0) {
			nodecg.log.warn(`Cue command ${splitAlert} has no mapped cues.`);
			return;
		}

		let cue : string | null = null;
		let orderedIndex = cmd.orderedMappingIndex || 0;
		if (cmd.mappedCues.length < orderedIndex) {
			orderedIndex = 0;
		}
		let nextOrderedIndex = null;
		switch (cmd.mapType) {
			case SoundCueMapType.single:
				cue = cmd.mappedCues[0];
				break;
			case SoundCueMapType.ordered:
				cue = cmd.mappedCues[orderedIndex];
				nextOrderedIndex = orderedIndex + 1;
				break;
			case SoundCueMapType.random:
				cue = cmd.mappedCues[Math.floor(Math.random() * cmd.mappedCues.length)];
				break;
			default:
				nodecg.log.warn(`Cue command ${splitAlert} has an invalid type.`);
				return;
		}
		if (!cue || !knownSoundCues.value.find((c) => c === cue)) {
			nodecg.log.warn(`Cue command ${splitAlert} did not map to a known cue. Mapped cue was ${cue || '"null"'}.`);
			return;
		}
		nodecg.sendMessage("PlaySoundCue", cue);
		soundCueMap.value[idx] = {
			...soundCueMap.value[idx],
			lastUseTimestamp: Date.now(),
			orderedMappingIndex: nextOrderedIndex,
			commandUsageCount: soundCueMap.value[idx].commandUsageCount + 1
		}
	});

	nodecg.listenFor('played-cue', (cueName: string, ack) => {
		nodecg.log.info("played cue: %s", cueName);
		if (cueName) {
			if (cueName in audioAlertLog.value) {
				audioAlertLog.value[cueName] += 1;
			} else {
				audioAlertLog.value[cueName] = 1;
			}
			nodecg.log.info("cue %s is now at %s plays", cueName, audioAlertLog.value[cueName]);
		}

		if (ack && !ack.handled) {
			ack(null);
		}
	});
};
