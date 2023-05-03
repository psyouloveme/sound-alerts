var e={current:null};let n,d;!function(e){e.soundCueConfig="soundCueConfig",e.soundCuesEnabled="soundCuesEnabled",e.soundCueList="soundCueList",e.soundCueLog="soundCueLog",e.soundCueTypes="soundCueTypes",e.soundCueCommandIndex="soundCueCommandIndex",e.nodeCGServerSoundCues="soundCues"}(n||(n={})),function(e){e.single="single",e.random="random",e.ordered="ordered"}(d||(d={}));var a=d;function o(d,o){if(!e.current)throw Error("Cue command change failed: NodeCG handle is invalid.");const u=e.current,l=u.Replicant(n.soundCueConfig);if(void 0===l.value&&o&&!o.handled)return void o(Error("Cue command change failed: Sound cue map is undefined."));const m=u.Replicant(n.soundCueList);if(void 0===l.value&&o&&!o.handled)return void o(Error("Cue command change failed: Sound cue list is undefined."));if(!d.commandName&&o&&!o.handled)return void o(Error("Cue command change failed: No cue command name was provided."));if((!d.mappedCues||0===d.mappedCues.length)&&o&&!o.handled)return void o(Error(`Cue command change failed: No cues were mapped to command ${d.commandName}.`));u.log.debug("changing cue command: %s",d.commandName);let i=l.value.findIndex((e=>e.commandName===d.commandName));if(i<0)l.value.push({commandName:d.commandName,coolDownMs:d.coolDownMs,commandType:d.commandType,enabled:d.enabled,orderedMappingIndex:d.commandType===a.ordered?0:null,commandUsageCount:0,lastUseTimestamp:null,allCuesAreValid:d.mappedCues.every((e=>m.value.includes(e))),mappedCues:[...d.mappedCues]});else{let e={...l.value[i],coolDownMs:d.coolDownMs,orderedMappingIndex:d.commandType===a.ordered?0:null,commandType:d.commandType,enabled:d.enabled,allCuesAreValid:d.mappedCues.every((e=>m.value.includes(e))),mappedCues:[...d.mappedCues]};l.value[i]=e}}function u(d,a){if(!e.current)throw Error("Cue command delete failed: NodeCG handle is invalid.");const o=e.current,u=o.Replicant(n.soundCueConfig);if(void 0===u.value&&a&&!a.handled)return void a(Error("Cue command delete failed: Sound cue map is undefined."));if(o.log.debug("deleting cue command: %s",d),!d&&a&&!a.handled)return void a(Error("Cue command delete failed: No cue command name was provided."));let l=u.value.findIndex((e=>e.commandName===d));l<0&&a&&!a.handled?a(Error(`Cue command delete failed: No cue command ${d} was found.`)):u.value=u.value.splice(l,1)}function l({user:n="",message:d=""}){if(!n||!d)return;if(!e.current)throw Error("Cue command change failed: NodeCG handle is invalid.");const a=e.current,o=a.Replicant(SoundAlertReplicants.soundCueConfig);if(void 0===o.value)return void a.log.error("Cue command change failed: Sound cue map is undefined.");const u=d.split(" ")[0];let l=o.value.findIndex((e=>e.commandName===u));if(l<0)return;const m=o.value[l];if(m.enabled||a.log.debug(`Cue command ${u} is disabled, not playing.`),!m.allCuesAreValid)return void a.log.warn(`Cue command ${u} has invalid cues, not playing.`);if(m.coolDownMs&&m.lastUseTimestamp&&Date.now()-m.lastUseTimestamp<m.coolDownMs)return void a.log.warn(`Cue command ${u} is still on cooldown, not playing.`);if(!m.mappedCues||0===m.mappedCues.length)return void a.log.warn(`Cue command ${u} has no mapped cues.`);let i=null,r=m.orderedMappingIndex||0;m.mappedCues.length<r&&(r=0);let s=null;switch(m.commandType){case SoundCommandType.single:i=m.mappedCues[0];break;case SoundCommandType.ordered:i=m.mappedCues[r],s=r+1;break;case SoundCommandType.random:i=m.mappedCues[Math.floor(Math.random()*m.mappedCues.length)];break;default:return void a.log.warn(`Cue command ${u} has an invalid type.`)}const t=a.Replicant(SoundAlertReplicants.soundCueList);void 0!==o.value?i&&t.value.find((e=>e===i))?(a.sendMessage(SoundCommandEvents.playSoundCue,i),o.value[l]={...o.value[l],lastUseTimestamp:Date.now(),orderedMappingIndex:s,commandUsageCount:o.value[l].commandUsageCount+1}):a.log.warn(`Cue command ${u} did not map to a known cue. Mapped cue was ${i||'"null"'}.`):a.log.error("Cue command change failed: Sound cue list is undefined.")}let m;!function(e){e.playedSoundCue="playedCue",e.playSoundCue="playSoundCue",e.upsertSoundCommand="upsertSoundCommand",e.deleteSoundCommand="deleteSoundCommand",e.twitchChatReceived="ChatReceived"}(m||(m={}));var i=m;let r;(r||(r={})).change="change";var s=r;function t(d,a){if(!e.current)throw Error("Cue command delete failed: NodeCG handle is invalid.");const o=e.current,u=o.Replicant(n.soundCueLog,{defaultValue:{}});o.log.info("played cue: %s",d),d&&(d in u.value?u.value[d]+=1:u.value[d]=1,o.log.info("cue %s is now at %s plays",d,u.value[d])),a&&!a.handled&&a(null)}let c;(c||(c={})).twitchListener="twitch-listener",module.exports=function(d){d.log.debug("Soundalerts bundle started."),e.current=d,d.Replicant(n.soundCueCommandIndex,{defaultValue:0}),d.Replicant(n.soundCuesEnabled,{defaultValue:!1}),d.Replicant(n.soundCueLog,{defaultValue:{}}),d.Replicant(n.soundCueTypes,{defaultValue:[a.ordered,a.random,a.single]});const m=d.Replicant(n.soundCueConfig);m.value=function(){if(!e.current)throw Error("Cue command mapping failed: NodeCG handle is invalid.");const d=e.current,o=[],u=d.readReplicant(n.nodeCGServerSoundCues),l=d.Replicant(n.soundCueCommandIndex);if(u&&u.length>0)for(let e=0;e<u.length;e++){let n=u[e];o.push({id:++l.value,commandName:n.name.startsWith("!")?n.name:`!${n.name}`,enabled:!1,coolDownMs:null,lastUseTimestamp:null,allCuesAreValid:!0,mappedCues:[n.name],orderedMappingIndex:null,commandType:a.single,commandUsageCount:0})}return o}();const r=d.Replicant(n.soundCueList,{defaultValue:[]});d.Replicant(n.nodeCGServerSoundCues).on(s.change,(e=>{r.value=e.map((e=>e.name))})),r.on(s.change,(e=>{m.value.forEach((n=>{n.allCuesAreValid=n.mappedCues.every((n=>e.includes(n)))}))})),d.listenFor(i.upsertSoundCommand,o),d.listenFor(i.deleteSoundCommand,u),d.listenFor(i.playedSoundCue,t),d.listenFor(i.twitchChatReceived,c.twitchListener,l)};
//# sourceMappingURL=index.js.map
