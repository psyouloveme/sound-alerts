const AUDIO_ALERTS=["!good","!bye","!fuku","!ine","!winner","!hello","!money","!challenger","!bigorsmall","!father","!heyboy","!hydrate","!wow","!wrong"],NIGHTBOT_ALERTS=[{audioCmd:"!blackmail",text:"don't you know that blackmail is waaaayyy uncool"},{audioCmd:"!key",text:"A key, but to what?"},{audioCmd:"!ticket2",text:"I need to pick up my ticket first."},{audioCmd:"!ticket1",text:"I should get my ticket before going to the harbor..."},{audioCmd:"!ticket3",text:"I should get the ticket first."},{audioCmd:"!wind",text:"Just the wind?"}],audioEnabled=nodecg.Replicant("audio_alerts_enabled"),onChatReceived=({user:e="",message:t=""},o)=>{if(e&&t&&audioEnabled.value||o&&!o.handled&&o(null,!0),AUDIO_ALERTS.forEach((e=>{t===e&&nodecg.playSound(e)})),"nightbot"===e.toLowerCase()){let e="";for(let o=0;o<NIGHTBOT_ALERTS.length&&!e;o++)NIGHTBOT_ALERTS[o].text===t.trim()&&(e=NIGHTBOT_ALERTS[o].audioCmd);if(e){const t=nodecg.findCue(e);t&&console.log(t),nodecg.playSound(e)}}o&&!o.handled&&o(null,!0)};nodecg.listenFor("ChatReceived","ncgio-layout",onChatReceived);
//# sourceMappingURL=index.35017299.js.map
