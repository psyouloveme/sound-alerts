const NIGHTBOT_ALERTS=[{audioCmd:"!blackmail",text:"don't you know that blackmail is waaaayyy uncool"},{audioCmd:"!key",text:"A key, but to what?"},{audioCmd:"!ticket2",text:"I need to pick up my ticket first."},{audioCmd:"!ticket1",text:"I should get my ticket before going to the harbor..."},{audioCmd:"!ticket3",text:"I should get the ticket first."},{audioCmd:"!wind",text:"Just the wind?"}],audioEnabled=nodecg.Replicant("audio_alerts_enabled"),onChatReceived=({user:e="",message:t=""},o)=>{if(!(e&&t&&audioEnabled.value&&t.startsWith("!")))return o&&!o.handled&&o(null,!0),void console.log("exiting early?");const d=t.split(" ")[0];if(d&&nodecg.findCue(d))nodecg.playSound(d);else if("nightbot"===e.toLowerCase()){let e="";for(let o=0;o<NIGHTBOT_ALERTS.length&&!e;o++)NIGHTBOT_ALERTS[o].text===t.trim()&&(e=NIGHTBOT_ALERTS[o].audioCmd);if(e){const t=nodecg.findCue(e);t&&console.log(t),nodecg.playSound(e)}}o&&!o.handled&&o(null,!0)};nodecg.listenFor("ChatReceived","ncgio-layout",onChatReceived);
//# sourceMappingURL=index.0c9f7268.js.map
