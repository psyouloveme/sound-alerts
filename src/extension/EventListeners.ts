import nodecgHandle from './NodeCGHandle'
import { type ListenForCb } from 'nodecg-types/types/lib/nodecg-instance'
import { SoundAlertReplicants } from '../types/SoundAlertReplicants'

export function playedSoundCue (cueName: string, ack?: ListenForCb): void {
  if (nodecgHandle.current == null) {
    throw Error('Cue command delete failed: NodeCG handle is invalid.')
  }
  const nodecg = nodecgHandle.current
  const audioAlertLog = nodecg.Replicant<AudioAlertLog>(SoundAlertReplicants.soundCueLog, {
    defaultValue: {}
  })

  nodecg.log.info('played cue: %s', cueName)
  if (cueName == null || cueName.length > 0) {
    if (cueName in audioAlertLog.value) {
      audioAlertLog.value[cueName] += 1
    } else {
      audioAlertLog.value[cueName] = 1
    }
    nodecg.log.info('cue %s is now at %s plays', cueName, audioAlertLog.value[cueName])
  }

  if ((ack != null) && !ack.handled) {
    ack(null)
  }
}
