
export enum CSSClasses {
  commandFormRow = 'commandFormRow',
  btnRemove = 'btnRemove',
  btnAdd = 'btnAdd',
  formGroup = 'formGroup',
  middle = 'middle',
  btnToggleEnabled = 'btnToggleEnabled',
  enabled = 'enabled',
  readOnly = 'readOnly',
  hidden = 'hidden',
  cueSelectWrapper = 'cueSelectWrapper'
};

export enum ElementIDs {
  cueConfigPanel = 'cueConfigPanel'
}

export enum FormFieldNames {
  id = 'id',
  name = 'commandName',
  cooldown = 'cooldownMs',
  type = 'commandType',
  cues = 'mappedCues'
}

export interface SoundCommandPartial {
  id: number
  commandName: string
  commandType: string
  mappedCues: string []
  coolDownMs: number | null
}

export interface ConfigFormState {
  editingRows: number[]
  submittingRows: number[]
  rowErrors: Record<number, string>
  rendered: boolean
  commandTypeOptions: SoundCommandType[]
}
