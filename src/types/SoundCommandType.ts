/**
 * Command type for the sound command configuration structure.
 * @see {@link SoundCommand} or {@link SoundCommandChangeMessage} for usages.
 */
export enum SoundCommandType {
  /**
     * Single commands expect only 1 mapped cue and play the first one
     * that was added to the cue list.
     */
  single = 'single',
  /**
     * Random commands will select a cue at random every call.
     */
  random = 'random',
  /**
     * Ordered commands will play the mapped cues in order on each call.
     */
  ordered = 'ordered'
};
