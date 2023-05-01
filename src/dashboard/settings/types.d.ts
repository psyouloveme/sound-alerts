
export enum CSSClasses {
    commandFormRow = "commandFormRow",
    btnRemove = "btnRemove",
    btnAdd = "btnAdd",
    formGroup = "formGroup",
    middle = "middle",
    btnToggleEnabled = "btnToggleEnabled",
    enabled = "enabled",
    readOnly = "readOnly",
    hidden = "hidden",
    cueSelectWrapper = "cueSelectWrapper"
};

export enum ElementIDs {
    cueConfigPanel = "cueConfigPanel"
};

export type ConfigFormState = {
    editingRows: number[],
    submittingRows: number[],
    rowErrors: Record<number, string>,
    rendered: boolean,
    commandTypeOptions: SoundCommandType[]
}