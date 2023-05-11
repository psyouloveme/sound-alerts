
const audioAlertsEnabled = nodecg.Replicant<boolean>('audio_alerts_enabled')
const knownSoundCues = nodecg.Replicant<string[]>('known_sound_cues')
const soundCueMap = nodecg.Replicant<SoundCueMapList>('sound_command_config')

NodeCG.waitForReplicants(audioAlertsEnabled, knownSoundCues, soundCueMap).then(() => {
  // change handler for audio alert enabled status
  audioAlertsEnabled.on('change', (nextVal) => {
    let target
    if (nextVal) {
      target = 'audio-enabled-yes'
    } else {
      target = 'audio-enabled-no'
    }
    const elem = document.getElementById(target) as HTMLInputElement
    if (elem) {
      elem.checked = true
    }
  })

  // bind a change handler for the dropdown
  const radios = document.querySelectorAll(
    "input[type=radio][name='audio-enabled']"
  )
  radios.forEach((radio) => {
    radio.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target && target.value) {
        if (target.value === 'Yes') {
          audioAlertsEnabled.value = true
        } else {
          audioAlertsEnabled.value = false
        }
      }
    })
  }
  )

  soundCueMap.on('change', (nextVal) => {
    if (!nextVal || nextVal.length === 0) {
      return
    }
    const panel = document.getElementById('cueMapPanel')
    if (panel == null) {
      return
    }
    nextVal.forEach((c) => {
      const div = document.createElement('div')
      let
    })
  })
})
.catch((error) => {
    console.error(error)
})