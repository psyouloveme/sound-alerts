import nodecgHandle from "./NodeCGHandle";

// old method
function onChatReceived({ user = "", message = "" }) {
	if (!user || !message || !message.startsWith("!")) {
	  return;
	}

	const splitAlert = message.split(" ")[0];
	if (splitAlert && nodecg.findCue(splitAlert)) {
	  nodecg.playSound(splitAlert);
	  nodecg.sendMessage(SoundCommandEvents.playedSoundCue, splitAlert);
	}
};

export function twitchChatReceived ({ user = "", message = "" }) {
	if (!user || !message) {
		return;
	}
	if (!nodecgHandle.current) {
		throw Error("Cue command change failed: NodeCG handle is invalid.");
	}
	const nodecg = nodecgHandle.current;

	const soundCueMap = nodecg.Replicant<SoundCommandList>(SoundAlertReplicants.soundCueConfig);
	if (soundCueMap.value === undefined) {
		nodecg.log.error(`Cue command change failed: Sound cue map is undefined.`);
		return;
	}

	const splitAlert = message.split(" ")[0];
	let idx = soundCueMap.value.findIndex((c) => c.commandName === splitAlert);
	if (idx < 0) {
		return;
	}
	const cmd = soundCueMap.value[idx];
	if (!cmd.enabled) {
		nodecg.log.debug(`Cue command ${splitAlert} is disabled, not playing.`);
	}
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
	
	switch (cmd.commandType) {
		case SoundCommandType.single:
			cue = cmd.mappedCues[0];
			break;
		case SoundCommandType.ordered:
			cue = cmd.mappedCues[orderedIndex];
			nextOrderedIndex = orderedIndex + 1;
			break;
		case SoundCommandType.random:
			cue = cmd.mappedCues[Math.floor(Math.random() * cmd.mappedCues.length)];
			break;
		default:
			nodecg.log.warn(`Cue command ${splitAlert} has an invalid type.`);
			return;
	}

	const knownSoundCues = nodecg.Replicant<SoundCueNameList>(SoundAlertReplicants.soundCueList);
	if (soundCueMap.value === undefined ) {
		nodecg.log.error(`Cue command change failed: Sound cue list is undefined.`);
		return;
	}

	if (!cue || !knownSoundCues.value.find((c) => c === cue)) {
		nodecg.log.warn(`Cue command ${splitAlert} did not map to a known cue. Mapped cue was ${cue || '"null"'}.`);
		return;
	}

	nodecg.sendMessage(SoundCommandEvents.playSoundCue, cue);
	soundCueMap.value[idx] = {
		...soundCueMap.value[idx],
		lastUseTimestamp: Date.now(),
		orderedMappingIndex: nextOrderedIndex,
		commandUsageCount: soundCueMap.value[idx].commandUsageCount + 1
	}
}