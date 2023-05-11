const audioEnabled = nodecg.Replicant('audio_alerts_enabled', {
  defaultValue: false
})

function playSoundCue (cueName: string): void {
  if ((cueName.length > 0) && (nodecg.findCue(cueName) != null)) {
    nodecg.playSound(cueName)
    void nodecg.sendMessage('played-cue', cueName)
  }
}

function onAudioEnabled (nextVal: boolean, prevVal: boolean): void {
  if (!prevVal && nextVal) {
    nodecg.listenFor('PlaySoundCue', playSoundCue)
  } else if (prevVal && !nextVal) {
    nodecg.unlisten('PlaySoundCue', playSoundCue)
  }
}

NodeCG.waitForReplicants(audioEnabled)
  .then(() => {
    audioEnabled.on('change', onAudioEnabled)
  })
  .catch((error) => {
    console.log(error)
  })
