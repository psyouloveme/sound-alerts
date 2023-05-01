module.exports=function(e){e.log.debug("Soundalerts bundle started."),e.Replicant("audio_alerts_enabled",{defaultValue:!1});const l=e.Replicant("audio-alert-log",{defaultValue:{}});e.listenFor("played-cue",((e,a)=>{e&&(e in l.value[e]?l.value[e]+=1:l.value[e]=1),a&&!a.handled&&a(null)}))};
//# sourceMappingURL=index.js.map
