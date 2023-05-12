import HtmlHelpers, { type SelectInputDataElem } from './HtmlHelpers'
import { SoundAlertReplicants } from '../../types/SoundAlertReplicants'
import { type SoundCueNameList } from '../../types/SoundCueNameList'
import { type SoundCommandType } from '../../types/SoundCommandType'
import ReplicantEvents from '../../types/ReplicantEvents'
import { ElementIDs, CSSClasses, FormFieldNames, type SoundCommandPartial } from './types.d'

const CommandConfig = nodecg.Replicant<SoundCommandList>(SoundAlertReplicants.soundCueConfig)
const CommandTypes = nodecg.Replicant<SoundCommandType[]>(SoundAlertReplicants.soundCueTypes)
const SoundCues = nodecg.Replicant<SoundCueNameList>(SoundAlertReplicants.soundCueList)
const CueIndex = nodecg.Replicant<number>(SoundAlertReplicants.soundCueCommandIndex)

function toggleCommandEnabled (id: number): void {
  if (CommandConfig?.value == null) {
    throw Error('Unable to retrieve command config - config replicant not available.')
  }
  const foundCommand = CommandConfig.value.find((c) => c.id === id)
  if (foundCommand == null) {
    throw Error(`Unable to find command with ID ${id}.`)
  }
  foundCommand.enabled = !foundCommand.enabled
}

function insertCommand (data: SoundCommandPartial): SoundCommand {
  if (CommandConfig?.value == null || CueIndex?.value == null) {
    throw Error('Unable to insert command config - config replicant not available.')
  }

  const newData: SoundCommand = {
    ...data,
    id: ++CueIndex.value,
    allCuesAreValid: true,
    enabled: true,
    lastUseTimestamp: null,
    orderedMappingIndex: 0,
    commandUsageCount: 0
  }
  CommandConfig.value.push(newData)
  return { ...newData }
}

function updateCommand (id: number, data: SoundCommandPartial): SoundCommand | null {
  if (CommandConfig?.value == null) {
    throw Error('Unable to update command config - config replicant not available.')
  }
  let updatedCommand: SoundCommand | null = null
  for (let i = 0; i < CommandConfig.value.length; i++) {
    if (CommandConfig.value[i].id === id) {
      updatedCommand = {
        ...CommandConfig.value[i],
        ...data
      }
      CommandConfig.value[i] = updatedCommand
      break
    }
  }
  return updatedCommand != null ? { ...updatedCommand } : null
}

function getCommandConfigById (id: number): SoundCommand {
  if (CommandConfig?.value == null) {
    throw Error('Unable to retrieve command config - config replicant not available.')
  }
  const foundCommand = CommandConfig.value.find((c) => c.id === id)
  if (foundCommand == null) {
    throw Error(`Unable to find command with ID ${id}.`)
  }
  return { ...foundCommand }
}

function getTypeOptions (defaultValue?: string): SelectInputDataElem[] {
  if (CommandTypes?.value == null) {
    throw Error('Unable to retrieve command types.')
  }
  const typeOptions = CommandTypes.value.reduce<SelectInputDataElem[]>((prev, curr) => {
    prev.push({
      label: curr,
      value: curr,
      selected: defaultValue === curr
    })
    return prev
  }, [{
    label: 'Select one',
    value: '-1',
    selected: defaultValue == null
  }])
  return typeOptions
}

function getCueOptions (defaultValue?: string, soundCues?: SoundCueNameList): SelectInputDataElem[] {
  let cues
  if (soundCues != null) {
    cues = soundCues
  } else {
    if (SoundCues?.value == null) {
      throw Error('Sound cue replicant not available.')
    }
    cues = SoundCues.value
  }

  const cueOptions = cues.reduce<SelectInputDataElem[]>((prev, curr) => {
    prev.push({
      label: curr,
      value: curr,
      selected: defaultValue === curr
    })
    return prev
  }, [{
    label: 'Select one',
    value: '-1',
    selected: defaultValue == null
  }])

  return cueOptions
}

function getCueOptionsList (mappedCues: SoundCueNameList): SelectInputDataElem[][] {
  if (SoundCues?.value == null) {
    throw Error('Sound cue replicant not available.')
  }
  const cues = SoundCues.value
  const cueOptionLists = mappedCues.map((c) => getCueOptions(c, cues))

  return cueOptionLists
}

/**
 * Mouse click event for the enable/disable button.
 * Apply changes to config instantly.
 * @param e button click event
 */
function onEnableButtonClicked (e: MouseEvent): void {
  e.preventDefault()
  if (CommandConfig?.value == null) {
    console.error('Failed enabling/disabling sound alert - replicant not available.')
    return
  }
  if (e.target == null) {
    console.error('Failed enabling/disabling sound alert - no event target found.')
    return
  }
  const target = e.target as HTMLButtonElement
  if (target.dataset.cmdName == null) {
    console.error('Failed enabling/disabling sound alert - command name found.')
    return
  }
  const form = target.closest('form') as HTMLFormElement
  if (form == null) {
    console.error('Failed sound alert edit - unable to locate form.')
    return
  }

  const cmdId = form.dataset.id
  if (cmdId == null || cmdId.length === 0) {
    console.error('Failed sound alert edit - unable to locate ID.')
    return
  }
  const id = parseInt(cmdId)
  if (isNaN(id)) {
    console.error('Failed sound alert edit - invalid ID found.')
    return
  }

  toggleCommandEnabled(id)
}

function removeValueElem (fg: HTMLDivElement): void {
  const selector = '.fieldValue'
  const fvs = fg.querySelectorAll(selector)
  if (fvs != null && fvs.length > 0) {
    for (let v = 0; v < fvs.length; v++) {
      const fieldToRemove = fvs[v]
      fg.removeChild(fieldToRemove)
    }
  }
}

function convertFormToReadonly (form: HTMLFormElement, nextValues?: SoundCommand): void {
  const id = (form.dataset.id != null) ? parseInt(form.dataset.id) : -1
  if (id < 0) {
    console.error('Failed sound alert edit - no ID found.')
    return
  }

  const formGroups = form.querySelectorAll('div.formGroup')
  if (formGroups.length <= 0) {
    console.error('Failed sound alert edit - unable to locate form groups.')
    return
  }

  const foundCommand = nextValues != null ? nextValues : getCommandConfigById(id)
  const fieldValueClass = ['fieldValue']

  for (let x = 0; x < formGroups.length; x++) {
    const fg = formGroups[x] as HTMLDivElement
    switch (fg.dataset.fieldName) {
      case 'name': {
        const nameInput = HtmlHelpers.buildSpan(foundCommand.commandName, fieldValueClass)
        removeValueElem(fg)
        fg.appendChild(nameInput)
        break
      }
      case 'cooldown': {
        const cooldownVal = (foundCommand.coolDownMs != null) ? foundCommand.coolDownMs.toString() : '0'
        const cooldownInput = HtmlHelpers.buildSpan(cooldownVal, fieldValueClass)
        removeValueElem(fg)
        fg.appendChild(cooldownInput)
        break
      }
      case 'type': {
        const typeInput = HtmlHelpers.buildSpan(foundCommand.commandType, fieldValueClass)
        removeValueElem(fg)
        fg.appendChild(typeInput)
        break
      }
      case 'cues': {
        const cueElem = HtmlHelpers.buildSpan(foundCommand.mappedCues.join((', ')), fieldValueClass)
        removeValueElem(fg)
        fg.append(cueElem)
        break
      }
      case 'edit': {
        const editButton = HtmlHelpers.buildButton('btnEdit', 'Edit', [])
        editButton.onclick = onEditButtonClick
        fg.replaceChildren(editButton)
        break
      }
      default:
        break
    }
  }

  form.removeEventListener('submit', onFormSubmit)
  form.dataset.editing = 'false'
}

function onEditCancelClick (event: MouseEvent): void {
  event.preventDefault()

  if (event.target == null) {
    console.error('Failed sound alert edit - no event target found.')
    return
  }
  const target = event.target as HTMLButtonElement
  const form = target.closest('form') as HTMLFormElement
  if (form == null) {
    console.error('Failed sound alert edit - unable to locate form.')
    return
  }
  convertFormToReadonly(form)
}

function onFormSubmit (event: SubmitEvent): void {
  event.preventDefault()
  if (event.target == null) {
    console.error('Failed saving sound alert - no event target found.')
    return
  }
  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  const id = formData.get(FormFieldNames.id) as string
  const cmdId = parseInt(id)
  if (isNaN(cmdId)) {
    console.error('Failed saving sound alert - no ID found.')
    return
  }

  const cmdName = formData.get(FormFieldNames.name) as string
  const cmdType = formData.get(FormFieldNames.type) as string
  const cmdCues = formData.getAll(FormFieldNames.cues) as string[]
  const cooldown = formData.get(FormFieldNames.cooldown) as string
  let cooldownValue: number | null = parseInt(cooldown)
  if (isNaN(cooldownValue) || cooldownValue === 0) {
    cooldownValue = null
  }
  console.log('id:', cmdId, 'name:', cmdName, 'cooldown', cooldown, 'type', cmdType, 'cues', cmdCues)
  const oldCommand = getCommandConfigById(cmdId)
  let updated: SoundCommand | null = null
  if (oldCommand == null) {
    updated = insertCommand({
      id: -1,
      commandName: cmdName,
      commandType: cmdType,
      mappedCues: cmdCues,
      coolDownMs: cooldownValue
    })
    if (updated == null) {
      throw new Error(`An error occurred creating sound command ${cmdName}, command not created.`)
    }
  } else {
    updated = updateCommand(cmdId, {
      id: cmdId,
      commandName: cmdName,
      commandType: cmdType,
      mappedCues: cmdCues,
      coolDownMs: cooldownValue
    })
    if (updated == null) {
      throw new Error(`An error occurred updating sound command ${cmdName}, command not updated.`)
    }
  }
  form.dataset.commandName = updated.commandName
  form.dataset.id = updated.id.toString()
  convertFormToReadonly(form, updated)
}

function onEditButtonClick (event: MouseEvent): void {
  event.preventDefault()

  if (event.target == null) {
    console.error('Failed sound alert edit - no event target found.')
    return
  }

  const target = event.target as HTMLButtonElement
  const form = target.closest('form') as HTMLFormElement
  if (form == null) {
    console.error('Failed sound alert edit - unable to locate form.')
    return
  }
  form.dataset.editing = 'true'
  form.addEventListener('submit', onFormSubmit)

  const id = (form.dataset.id != null) ? parseInt(form.dataset.id) : -1
  if (id < 0) {
    console.error('Failed sound alert edit - no ID found.')
    return
  }

  const formGroups = form.querySelectorAll('div.formGroup')
  if (formGroups.length <= 0) {
    console.error('Failed sound alert edit - unable to locate form groups.')
    return
  }

  const foundCommand = getCommandConfigById(id)
  const fieldValueClass = ['fieldValue']

  for (let x = 0; x < formGroups.length; x++) {
    const fg = formGroups[x] as HTMLDivElement
    switch (fg.dataset.fieldName) {
      case 'name': {
        const nameInput = HtmlHelpers.buildTextInput(FormFieldNames.name, foundCommand.commandName, fieldValueClass)
        removeValueElem(fg)
        fg.appendChild(nameInput)
        break
      }
      case 'cooldown': {
        const cooldownVal = (foundCommand.coolDownMs != null) ? foundCommand.coolDownMs.toString() : '0'
        const cooldownInput = HtmlHelpers.buildNumberInput(FormFieldNames.cooldown, cooldownVal, fieldValueClass)
        removeValueElem(fg)
        fg.appendChild(cooldownInput)
        break
      }
      case 'type': {
        const typeOptions = getTypeOptions(foundCommand.commandType)
        const typeInput = HtmlHelpers.buildSelect(fieldValueClass, FormFieldNames.type, typeOptions)
        removeValueElem(fg)
        fg.appendChild(typeInput)
        break
      }
      case 'cues': {
        const cueLists = getCueOptionsList(foundCommand.mappedCues)
        const cueElems = cueLists.map((c) => {
          return HtmlHelpers.buildSelect(fieldValueClass, FormFieldNames.cues, c)
        })
        removeValueElem(fg)
        fg.append(...cueElems)
        break
      }
      case 'edit': {
        const saveButton = HtmlHelpers.buildButton('btnSave', 'Save', [CSSClasses.btnAdd])
        const cancelButton = HtmlHelpers.buildButton('btnCancel', 'Cancel', [])
        cancelButton.onclick = onEditCancelClick
        const deleteButton = HtmlHelpers.buildButton('btnDelete', 'Delete', [CSSClasses.btnRemove])
        fg.replaceChildren(saveButton, cancelButton, deleteButton)
        break
      }
      default:
        break
    }
  }
}

function buildEnableButton (enabled: boolean, commandName: string): HTMLButtonElement {
  const txt = enabled ? 'On' : 'Off'
  const btn = HtmlHelpers.buildButton('btnEnabled', txt, [CSSClasses.btnToggleEnabled])
  if (enabled) {
    btn.classList.add(CSSClasses.enabled)
  }
  btn.onclick = onEnableButtonClicked
  btn.dataset.cmdName = commandName
  btn.dataset.enabled = enabled.toString()
  return btn
}

function buildFormGroup (extraClasses?: CSSClasses[]): HTMLDivElement {
  let classes = [CSSClasses.formGroup]
  if (extraClasses != null) {
    classes = classes.concat(extraClasses)
  }
  const elem = HtmlHelpers.buildDiv(undefined, classes)
  return elem
}

// function btnRemoveClick (e: MouseEvent): void {
//   e.preventDefault()
//   if (CommandConfig?.value == null) {
//     console.error('Failed removing command - replicant not available.')
//     return
//   }
//   if (e.target == null) {
//     console.error('Failed removing command - no event target found.')
//     return
//   }
//   const target = e.target as HTMLButtonElement
//   if (target.dataset?.cmdName == null) {
//     console.error('Failed removing command - command name found.')
//   }
// }

function buildReadonlyFormGroup (fieldName: string, labelName: string, label: string, text: string): HTMLDivElement {
  const fg = buildFormGroup()
  fg.dataset.fieldName = fieldName
  const labelElem = HtmlHelpers.buildLabel(labelName, label)
  const spanElem = HtmlHelpers.buildSpan(text, ['fieldValue'])
  fg.append(labelElem, spanElem)
  return fg
}

function mapCommandToForm (cmd: SoundCommand, index: number): HTMLFormElement {
  if (CommandTypes?.value == null) {
    throw Error('Unable to map command rows - no command types are loaded.')
  }

  if (SoundCues?.value == null) {
    throw Error('Unable to map command rows - no sound cues are loaded.')
  }

  console.log(JSON.stringify(cmd))

  const rowDiv = HtmlHelpers.buildForm(`commandForm-${cmd.id}`, null, [])
  rowDiv.dataset.id = cmd.id.toString()
  rowDiv.dataset.commandName = cmd.commandName
  rowDiv.dataset.index = index.toString()
  rowDiv.dataset.editing = 'false'

  const newFormRow = HtmlHelpers.buildDiv(`cmd-row-${cmd.id}`, [CSSClasses.commandFormRow])

  // enable/disable button
  let fg = buildFormGroup([CSSClasses.middle])
  fg.dataset.fieldName = 'enabled'
  let btn = buildEnableButton(cmd.enabled, cmd.commandName)
  fg.appendChild(btn)
  newFormRow.appendChild(fg)

  fg = buildFormGroup([CSSClasses.middle])
  fg.dataset.fieldName = 'id'
  const span = HtmlHelpers.buildSpan(cmd.id.toString())
  fg.appendChild(span)
  const hid = HtmlHelpers.buildHiddenInput(FormFieldNames.id, cmd.id.toString())
  fg.appendChild(hid)
  newFormRow.appendChild(fg)

  // command name field
  fg = buildReadonlyFormGroup('name', 'commandName', 'Name', cmd.commandName)
  newFormRow.appendChild(fg)

  // cooldown field
  const txt = (cmd.coolDownMs != null) ? `${cmd.coolDownMs} ms` : 'None'
  fg = buildReadonlyFormGroup('cooldown', 'coolDownMs', 'Cooldown', txt)
  newFormRow.appendChild(fg)

  // command type field
  fg = buildReadonlyFormGroup('type', 'commandType', 'Type', cmd.commandType)
  newFormRow.appendChild(fg)

  // mapped cues
  const cueTxt = cmd.mappedCues.length <= 0 ? 'None' : cmd.mappedCues.join(', ')
  fg = buildReadonlyFormGroup('cues', 'mappedCues', 'Cues', cueTxt)
  newFormRow.appendChild(fg)

  // edit button
  fg = buildFormGroup([CSSClasses.middle])
  fg.dataset.fieldName = 'edit'
  btn = HtmlHelpers.buildButton('', 'Edit', [])
  btn.onclick = onEditButtonClick
  fg.appendChild(btn)
  newFormRow.appendChild(fg)

  // add the row to the form
  rowDiv.appendChild(newFormRow)
  return rowDiv
}

function initializeSoundCueForms (config: SoundCommandList): void {
  const mapPanel = document.getElementById(ElementIDs.cueConfigPanel)
  if (mapPanel == null) {
    console.error('Unable to locate panel, skipping form initialization.')
    return
  }
  const rows = config.map(mapCommandToForm)
  mapPanel.append(...rows)
}

function updateValueElem (fg: HTMLDivElement, value: string): void {
  const selector = '.fieldValue'
  const fv = fg.querySelector(selector) as HTMLInputElement | HTMLSpanElement | HTMLSelectElement
  if (fv != null) {
    if (fv.tagName === 'span') {
      (fv as HTMLSpanElement).innerText = value
    } else if (fv.tagName === 'input') {
      (fv as HTMLInputElement).value = value
    } else if (fv.tagName === 'select') {
      (fv as HTMLSelectElement).value = value
    }
  }
}

function updateSoundCueForms (newConfig: SoundCommandList, oldConfig: SoundCommandList): void {
  const mapPanel = document.getElementById(ElementIDs.cueConfigPanel)
  if (mapPanel == null) {
    console.error('Unable to locate panel, skipping form update.')
    return
  }
  const foundIds = []
  for (let i = 0; i < newConfig.length; i++) {
    const cfg = newConfig[i]
    foundIds.push(cfg.id)
    // let hasChanges = false
    const oldCfg = (i < oldConfig.length) ? oldConfig[i] : null
    const form = document.querySelector(`form[data-id='${cfg.id}']`) as HTMLFormElement

    if (oldCfg != null) {
      if (oldCfg.allCuesAreValid !== cfg.allCuesAreValid) {
        // hasChanges = true
      }
      if (oldCfg.lastUseTimestamp !== cfg.lastUseTimestamp) {
        // hasChanges = true
      }
      if (oldCfg.commandName !== cfg.commandName) {
        // hasChanges = true
        const fg = form.querySelector('div.formGroup[data-field-name="name"]') as HTMLDivElement
        if (fg != null) {
          updateValueElem(fg, cfg.commandName)
        }
      }
      if (oldCfg.commandType !== cfg.commandType) {
        // hasChanges = true
        const fg = form.querySelector('div.formGroup[data-field-name="type"]') as HTMLDivElement
        if (fg != null) {
          updateValueElem(fg, cfg.commandType)
        }
      }
      if (oldCfg.commandUsageCount !== cfg.commandUsageCount) {
        // hasChanges = true
      }
      if (oldCfg.coolDownMs !== cfg.coolDownMs) {
        // hasChanges = true
        const fg = form.querySelector('div.formGroup[data-field-name="cooldown"]') as HTMLDivElement
        if (fg != null) {
          updateValueElem(fg, (cfg.coolDownMs != null) ? cfg.coolDownMs.toString() : '0')
        }
      }
      if (oldCfg.enabled !== cfg.enabled) {
        // hasChanges = true
        const fg = form.querySelector('div.formGroup[data-field-name="enabled"]') as HTMLDivElement
        if (fg != null) {
          const btn = fg.querySelector('button') as HTMLButtonElement
          btn.dataset.enabled = cfg.enabled.toString()
          if (cfg.enabled) {
            btn.innerText = 'On'
            btn.classList.add(CSSClasses.enabled)
          } else {
            btn.innerText = 'Off'
            btn.classList.remove(CSSClasses.enabled)
          }
        }
      }
      if (oldCfg.orderedMappingIndex !== cfg.orderedMappingIndex) {
        // hasChanges = true
      }
      if (oldCfg.id !== cfg.id) {
        // hasChanges = true
      }
      const oldCues = oldCfg.mappedCues
      const newCues = cfg.mappedCues
      if ((oldCues.length !== newCues.length) || !newCues.every((c, idx) => c === oldCues[idx])) {
        // hasChanges = true
        const fg = form.querySelector('div.formGroup[data-field-name="cues"]') as HTMLDivElement
        if (form.dataset.editing != null) {
          // if we're editing, just delete all the old dropdowns
          const cueLists = getCueOptionsList(newCues)
          const cueElems = cueLists.map((c) => {
            return HtmlHelpers.buildSelect(['fieldValue'], 'mappedCues', c)
          })
          removeValueElem(fg)
          fg.append(...cueElems)
        } else {
          if (fg != null) {
            updateValueElem(fg, newCues.join(', '))
          }
        }
      }
    } else {
      const row = mapCommandToForm(cfg, i)
      mapPanel.append(row)
    }
  }
}

function teardownSoundCueForms (): void {
  const mapPanel = document.getElementById(ElementIDs.cueConfigPanel)
  if (mapPanel == null) {
    console.error('Unable to locate panel, skipping form teardown.')
  }
}

function onSoundCommandConfigChange (newConfig: SoundCommandList, oldConfig: SoundCommandList): void {
  if (!Array.isArray(newConfig)) {
    console.error('No config was provided, skipping form render.')
    return
  }

  if (newConfig != null && oldConfig == null) {
    // create from scratch
    initializeSoundCueForms(newConfig)
  } else if (newConfig != null && oldConfig != null) {
    // update the dom
    updateSoundCueForms(newConfig, oldConfig)
  } else if (newConfig != null && oldConfig == null) {
    // tear down the forms
    teardownSoundCueForms()
  }
};

function setupSoundCueConfigForm (): void {
  NodeCG.waitForReplicants(CommandConfig, CommandTypes, SoundCues, CueIndex)
    .then(() => {
      CommandConfig.on(ReplicantEvents.change, onSoundCommandConfigChange)
    })
    .catch((err) => {
      console.error(err)
    })
}

document.addEventListener('DOMContentLoaded', setupSoundCueConfigForm)
