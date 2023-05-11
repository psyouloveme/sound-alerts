/**
 * File information structure for NodeCG assets.
 * Most likely this applies to all assets but only
 * cues are relevant here.
 * This is a TS workaround until migrating to NodeCG v2.
 */
interface CueAssetFile {
  sum: string
  base: string
  ext: string
  name: string
  url: string
  default: boolean
}

/**
 * NodeCG Sound Cue asset information structure.
 * This is a TS workaround until migrating to NodeCG v2.
 */
interface CueAsset {
  name: string
  channels: number
  defaultVolume: number
  assignable: boolean
  defaultFile: CueAssetFile
  file: CueAssetFile
  volume: number
};

/**
 * NodeCG Sound Cue Asset list, as retreived from the
 * "soundCues" replicant.
 * This is a TS workaround until migrating to NodeCG v2.
 */
type CueAssets = CueAsset[]
