// Temporary types until NodeCG 2 migration
interface CueAssetFile {
    sum: string;
    base: string;
    ext: string;
    name: string;
    url: string;
    default: boolean;
}

interface CueAsset {
    name: string;
    channels: number;
    defaultVolume: number;
    assignable: boolean;
    defaultFile: CueAssetFile;
    file: CueAssetFile;
    volume: number;
};

type CueAssets = CueAsset[];