const e=nodecg.Replicant("audio_alerts_enabled",{defaultValue:!1});function n(e){e&&nodecg.findCue(e)&&(nodecg.playSound(e),nodecg.sendMessage("played-cue",e))}NodeCG.waitForReplicants(e).then((()=>{e.on("change",((e,d)=>{!d&&e?nodecg.listenFor("PlaySoundCue",n):d&&!e&&nodecg.unlisten("PlaySoundCue",n)}))}));
//# sourceMappingURL=index.5e4a31b1.js.map
