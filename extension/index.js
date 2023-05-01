module.exports=function(e){e.log.debug("Soundalerts bundle started."),e.Replicant("audio_alerts_enabled",{defaultValue:!1});const l=e.Replicant("audio-alert-log",{defaultValue:{}});e.listenFor("played-cue",((a,u)=>{a&&(a in l.value?l.value[a]+=1:l.value[a]=1,e.log.debug("cue %s is now at %s plays",a,l.value[a])),u&&!u.handled&&u(null)}))};
//# sourceMappingURL=index.js.map
