const audioEnabled = nodecg.Replicant("audio_alerts_enabled", {
  defaultValue: false,
});

function playSoundCue(cueName: string) {
  if (cueName && nodecg.findCue(cueName)) {
    nodecg.playSound(cueName);
    nodecg.sendMessage("played-cue", cueName);
  }
}

NodeCG.waitForReplicants(audioEnabled).then(() => {
  audioEnabled.on("change", (nextVal, prevVal) => {
    if (!prevVal && nextVal) {
      nodecg.listenFor("PlaySoundCue", playSoundCue);
    } else if (prevVal && !nextVal) {
      nodecg.unlisten("PlaySoundCue", playSoundCue);
    }
  });
});

