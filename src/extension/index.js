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
			if (cueName in audioAlertLog.value) {
				audioAlertLog.value[cueName] += 1;
			} else {
				audioAlertLog.value[cueName] = 1;
			}

			nodecg.log.debug('cue %s is now at %s plays', cueName, audioAlertLog.value[cueName]);
		}

		if (ack && !ack.handled) {
			ack(null);
		}
	});
};
