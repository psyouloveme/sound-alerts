import { SoundAlertReplicants, type SoundCueNameList } from '../types/SoundAlertReplicants.d'
import SoundCommandType from '../types/SoundCommandType.d'
import nodecgHandle from './NodeCGHandle'
import { type ListenForCb } from 'nodecg-types/types/lib/nodecg-instance'

export function upsertSoundCommand (newCue: SoundCommandChangeMessage, ack?: ListenForCb) {
  if (nodecgHandle.current == null) {
    throw Error('Cue command change failed: NodeCG handle is invalid.')
  }
  const nodecg = nodecgHandle.current

  const soundCueMap = nodecg.Replicant<SoundCommandList>(SoundAlertReplicants.soundCueConfig)
  if (soundCueMap.value === undefined && (ack != null) && !ack.handled) {
    ack(Error('Cue command change failed: Sound cue map is undefined.'))
    return
  }

  const knownSoundCues = nodecg.Replicant<SoundCueNameList>(SoundAlertReplicants.soundCueList)
  if (soundCueMap.value === undefined && (ack != null) && !ack.handled) {
    ack(Error('Cue command change failed: Sound cue list is undefined.'))
    return
  }

  if (!newCue.commandName && (ack != null) && !ack.handled) {
    ack(Error('Cue command change failed: No cue command name was provided.'))
    return
  }
  if ((!newCue.mappedCues || newCue.mappedCues.length === 0) && (ack != null) && !ack.handled) {
    ack(Error(`Cue command change failed: No cues were mapped to command ${newCue.commandName}.`))
    return
  }

  nodecg.log.debug('changing cue command: %s', newCue.commandName)
  const idx = soundCueMap.value.findIndex((c) => c.commandName === newCue.commandName)
  if (idx < 0) {
    soundCueMap.value.push({
      commandName: newCue.commandName,
      coolDownMs: newCue.coolDownMs,
      commandType: newCue.commandType,
      enabled: newCue.enabled,
      orderedMappingIndex: newCue.commandType === SoundCommandType.ordered ? 0 : null,
      commandUsageCount: 0,
      lastUseTimestamp: null,
      allCuesAreValid: newCue.mappedCues.every((mc) => knownSoundCues.value.includes(mc)),
      mappedCues: [...newCue.mappedCues]
    })
  } else {
    const oldCue = soundCueMap.value[idx]
    const nextCue = {
      ...oldCue,
      coolDownMs: newCue.coolDownMs,
      orderedMappingIndex: newCue.commandType === SoundCommandType.ordered ? 0 : null,
      commandType: newCue.commandType,
      enabled: newCue.enabled,
      allCuesAreValid: newCue.mappedCues.every((mc) => knownSoundCues.value.includes(mc)),
      mappedCues: [...newCue.mappedCues]
    }
    soundCueMap.value[idx] = nextCue
  }
}

export function deleteSoundCommand (commandName: string, ack?: ListenForCb) {
  if (nodecgHandle.current == null) {
    throw Error('Cue command delete failed: NodeCG handle is invalid.')
  }
  const nodecg = nodecgHandle.current

  const soundCueMap = nodecg.Replicant<SoundCommandList>(SoundAlertReplicants.soundCueConfig)
  if (soundCueMap.value === undefined && (ack != null) && !ack.handled) {
    ack(Error('Cue command delete failed: Sound cue map is undefined.'))
    return
  }

  nodecg.log.debug('deleting cue command: %s', commandName)
  if (!commandName && (ack != null) && !ack.handled) {
    ack(Error('Cue command delete failed: No cue command name was provided.'))
    return
  }

  const idx = soundCueMap.value.findIndex((c) => c.commandName === commandName)
  if (idx < 0 && (ack != null) && !ack.handled) {
    ack(Error(`Cue command delete failed: No cue command ${commandName} was found.`))
    return
  }

  soundCueMap.value = soundCueMap.value.splice(idx, 1)
}
