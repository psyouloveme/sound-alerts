const NIGHTBOT_ALERTS = [
	{
		audioCmd: '!blackmail',
		text: 'don\'t you know that blackmail is waaaayyy uncool'
	},
	{audioCmd: '!key', text: 'A key, but to what?'},
	{audioCmd: '!ticket2', text: 'I need to pick up my ticket first.'},
	{
		audioCmd: '!ticket1',
		text: 'I should get my ticket before going to the harbor...'
	},
	{audioCmd: '!ticket3', text: 'I should get the ticket first.'},
	{audioCmd: '!wind', text: 'Just the wind?'}
];

const audioEnabled = nodecg.Replicant('audio_alerts_enabled');
const onChatReceived = ({user = '', message = ''}) => {
	if (!audioEnabled.value || !user || !message || (user !== 'nightbot' && !message.startsWith('!'))) {
		console.log('exiting early');
		return;
	}

	const splitAlert = message.split(' ')[0];
	if (splitAlert && nodecg.findCue(splitAlert)) {
		nodecg.playSound(splitAlert);
	} else if (user.toLowerCase() === 'nightbot') {
		let sendCmd = '';
		for (let i = 0; i < NIGHTBOT_ALERTS.length && !sendCmd; i++) {
			if (NIGHTBOT_ALERTS[i].text === message.trim()) {
				sendCmd = NIGHTBOT_ALERTS[i].audioCmd;
			}
		}

		if (sendCmd && nodecg.findCue(sendCmd)) {
			nodecg.playSound(sendCmd);
		}
	}
};

nodecg.listenFor('ChatReceived', 'twitch-listener', onChatReceived);
