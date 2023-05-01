/**
 * Sound Command Change (create/update) message.
 * @see {@link SoundCommand} for extended property information.
 */
interface SoundCommandChangeMessage {
    /** 
     * Name of the chat sound command to create/update
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
     * Cooldown (in ms) for this chat command.
     */
    coolDownMs: number | null;
    /** 
     * Array of sound cue names associated with this command.
     */
    mappedCues: string[];

}
