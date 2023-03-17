module.exports = function (nodecg) {
	nodecg.log.debug('Soundalerts bundle started.');
	nodecg.Replicant('audio_alerts_enabled', {
		defaultValue: false
	});
	const audioAlertLog = nodecg.Replicant('audio-alert-log', {
		defaultValue: {}
	});

	nodecg.listenFor('played-cue', (cueName, ack) => {
		if (cueName) {
			if (cueName in audioAlertLog.value[cueName]) {
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
