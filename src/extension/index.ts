import { NodeCG } from "nodecg-types/types/server";

module.exports = function (nodecg : NodeCG) {
	nodecg.log.debug('Soundalerts bundle started.');
	nodecg.Replicant('audio_alerts_enabled', {
		defaultValue: false
	});
	const audioAlertLog = nodecg.Replicant<AudioAlertLog>('audio-alert-log', {
		defaultValue: {}
	});

	nodecg.listenFor('played-cue', (cueName: string, ack) => {
		if (cueName) {
			if (cueName in audioAlertLog.value) {
				audioAlertLog.value[cueName] += 1;
			} else {
				audioAlertLog.value[cueName] = 1;
			}
		}

		if (ack && !ack.handled) {
			ack(null);
		}
	});
};
