import nodecgHandle from "./NodeCGHandle";
import { ListenForCb } from "nodecg-types/types/lib/nodecg-instance";
import { SoundAlertReplicants } from "../types/SoundAlertReplicants.d";

export function playedSoundCue(cueName: string, ack?: ListenForCb) {
	if (!nodecgHandle.current) {
		throw Error("Cue command delete failed: NodeCG handle is invalid.");
	}
	const nodecg = nodecgHandle.current;
	const audioAlertLog = nodecg.Replicant<AudioAlertLog>(SoundAlertReplicants.soundCueLog, {
		defaultValue: {}
	});
	
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
}