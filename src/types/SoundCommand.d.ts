/**
 * Sound Command configuration structure.
 */
interface SoundCommand { 
    /** 
     * Name of the chat sound command 
     * @example "!ticket" 
     */
    commandName: string;
    /**
     * The command type for the sound cues associated with this command.
     * @see {@link SoundCommandType} for command type info.
     */
    commandType: SoundCommandType;
    /** 
     * Enable or disable the command.
     */
    enabled: boolean;
    /** 
     * Cooldown (in ms) for this chat command. Set <= 0 or null to disable.
     * @example 5000 
     */
    coolDownMs: number | null;
    /** 
     * UNIX timestamp of the last time this command completed.
     * Set by extension after the play cue message is sent.
     * @example 1682890764376 
     */
    lastUseTimestamp: number | null;
    /**
     * Count of how many times this command completed.
     * Updated by extension after the play cue message is sent.
     */
    commandUsageCount: number;
    /**
     * State of the mapped cues for this command. 
     * Updated by extension when the registered sound cues change.
     */
    allCuesAreValid: boolean;
    /**
     * Used when commandType = ordered, this is the index of 
     * the next mapped sound cue to play.
     */
    orderedMappingIndex: number | null;
    /**
     * Array of sound cue names associated with this command.
     * {@link SoundCommand.commandType} controls which cue will play.
     */
    mappedCues: string[];
};

/**
 * Sound Command list for replicants.
 * @see {@link SoundCommand} for config detail
 * @see {@link SoundAlertReplicants} for replicant names
 */
type SoundCommandList = SoundCommand[];
