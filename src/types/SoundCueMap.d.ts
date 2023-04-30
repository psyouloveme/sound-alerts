enum SoundCueMapType {
    single = "single",
    random = "random",
    ordered = "ordered"
 };

interface SoundCueMap { 
    commandName: string;
    coolDownMs: number | null;
    lastUseTimestamp: number | null;
    commandUsageCount: number;
    allCuesAreValid: boolean;
    mapType: SoundCueMapType;
    orderedMappingIndex: number | null;
    mappedCues: string[];
};

interface CueMapChange {
    commandName: string;
    coolDownMs: number | null;
    mappedCues: string[];
    mapType: SoundCueMapType;
}

interface CueMapDelete {
    commandName: string;
}


type SoundCueMapList = SoundCueMap[];
