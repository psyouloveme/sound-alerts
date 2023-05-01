import HtmlHelpers, { SelectInputDataElem } from "./HtmlHelpers";

const CommandConfig = nodecg.Replicant<SoundCommandList>(SoundAlertReplicants.soundCueConfig);
const CommandTypes = nodecg.Replicant<SoundCommandType[]>(SoundAlertReplicants.soundCueTypes);
const SoundCues = nodecg.Replicant<SoundCueNameList>(SoundAlertReplicants.soundCueList);

const CommandFormState : ConfigFormState = {
    editingRows: [],
    submittingRows: [],
    rowErrors: {},
    rendered: false,
    commandTypeOptions: [],
}

/**
 * Mouse click event for the enable/disable button.
 * Apply changes to config instantly.
 * @param e button click event
 */
function onEnableButtonClicked(e: MouseEvent) {
    e.preventDefault();
    if (!CommandConfig || !CommandConfig.value) {
        console.error("Failed enabling/disabling sound alert - replicant not available.");
        return;
    }
    if (!e.target) {
        console.error("Failed enabling/disabling sound alert - no event target found.")
        return;
    }
    const target = e.target as HTMLButtonElement;
    if (!target.dataset.cmdName) {
        console.error("Failed enabling/disabling sound alert - command name found.")
        return;
    }


    const cmdName = target.dataset.cmdName;
    const foundCommand = CommandConfig.value.find((c) => c.commandName === cmdName);
    if (!foundCommand) {
        console.error(`Failed enabling/disabling sound alert - command found for "${cmdName}" not found.`)
        return;
    }
    
    // check the target's dataset prop.
    const enabled = (target.dataset.enabled === "true");    
    
    // this will trigger a re-render
    foundCommand.enabled = !enabled;
}

function buildEnableButton(enabled: boolean, commandName: string) {
    let txt = enabled ? 'On' : "Off";
    const btn = HtmlHelpers.buildButton("btnEnabled", txt, [CSSClasses.btnToggleEnabled]);
    btn.onclick = onEnableButtonClicked;
    btn.dataset.cmdName = commandName;
    btn.dataset.enabled = enabled.toString();
    return btn;
}

function buildFormGroup(extraClasses?: CSSClasses[]) {
    let classes = [ CSSClasses.formGroup, ]
    if (extraClasses) {
        classes = classes.concat(extraClasses)
    }
    const elem = HtmlHelpers.buildDiv(undefined, classes);
    return elem;
}

function btnRemoveClick(e: MouseEvent) {
    e.preventDefault();
    if (!CommandConfig || !CommandConfig.value) {
        console.error("Failed removing command - replicant not available.");
        return;
    }
    if (!e.target) {
        console.error("Failed removing command - no event target found.")
        return;
    }
    const target = e.target as HTMLButtonElement;
    if (!target.dataset.cmdName) {
        console.error("Failed removing command - command name found.")
        return;
    }
}


function mapCommandToForm(cmd: SoundCommand, index: number) { 
    if (!CommandTypes || !CommandTypes.value) {
        throw Error("Unable to map command rows - no command types are loaded.");
    }

    if (!SoundCues || !SoundCues.value) {
        throw Error("Unable to map command rows - no sound cues are loaded.");
    }

    const rowClasses = [ CSSClasses.commandFormRow, ];
    const newFormRow = HtmlHelpers.buildDiv(`cmd-row-${cmd.commandName}`, rowClasses);

    // enable/disable button
    let fg = buildFormGroup([CSSClasses.middle]);
    let btn = buildEnableButton(cmd.enabled, cmd.commandName);
    fg.appendChild(btn);
    newFormRow.appendChild(fg)


    const hiddenClasses = [CSSClasses.hidden];

    fg = buildFormGroup();
    let label = HtmlHelpers.buildLabel("commandName", "Command Name");
    let input = HtmlHelpers.buildTextInput("commandName", cmd.commandName, hiddenClasses);
    let span = HtmlHelpers.buildSpan(cmd.commandName);
    fg.append(label, input, span);
    newFormRow.appendChild(fg)

    fg = buildFormGroup();
    label = HtmlHelpers.buildLabel("coolDownMs", "Cooldown");
    let cooldownValue = cmd.coolDownMs ? cmd.coolDownMs.toString() : "0";
    input = HtmlHelpers.buildNumberInput("coolDownMs", cooldownValue, hiddenClasses)
    span = HtmlHelpers.buildSpan(cooldownValue);
    fg.append(label, input, span);
    newFormRow.appendChild(fg)

    
    const commandTypeOptions = CommandTypes.value.map((val) => ({
        label: val,
        value: val,
        selected: cmd.commandType === val,
    })) as SelectInputDataElem[];
    fg = buildFormGroup();
    label = HtmlHelpers.buildLabel("commandType", "Type");
    let select = HtmlHelpers.buildSelect(hiddenClasses, "commandType", commandTypeOptions)
    span = HtmlHelpers.buildSpan(cmd.commandType);
    fg.append(label, select, span);
    newFormRow.appendChild(fg)

    fg = buildFormGroup();
    label = HtmlHelpers.buildLabel("mappedCues", "Cues");

    const hasMappedCue = (cmd.mappedCues.length > 0);
    const mappedCues: SelectInputDataElem[] = [];
    mappedCues.push({
        label: "Select one",
        value: "-1",
        selected: (!hasMappedCue)
    })
    for (let g = 0; g < SoundCues.value.length; g++) {
        const v = SoundCues.value[g];
        mappedCues.push({
            label: v,
            value: v,
            selected: false
        });
    }

    if (cmd.mappedCues.length === 0) {
        span = HtmlHelpers.buildSpan("None");
        const innerDiv = HtmlHelpers.buildDiv(undefined, [CSSClasses.cueSelectWrapper])
        
        const cueListCopy = mappedCues.map((a) => ({ ...a }));
        select = HtmlHelpers.buildSelect(hiddenClasses, `mappedCues[]`, cueListCopy); 
        innerDiv.appendChild(select);

        fg.appendChild(innerDiv);
    } else {
        span = HtmlHelpers.buildSpan(cmd.mappedCues.join(", "));

        for (let i = 0; i < cmd.mappedCues.length; i++) {
            const innerDiv = HtmlHelpers.buildDiv(undefined, [CSSClasses.cueSelectWrapper])
            const mc = cmd.mappedCues[i];
            const cueListCopy = mappedCues.map((a) => {
                return {
                    ...a,
                    selected : mc === a.value
                }
            })
            select = HtmlHelpers.buildSelect(hiddenClasses, `mappedCues[]`, cueListCopy); 
            if (i > 0) {
                const btn = HtmlHelpers.buildButton("", "-", [CSSClasses.btnRemove, CSSClasses.hidden]);
                innerDiv.appendChild(btn);
            }
            fg.appendChild(innerDiv);
        }
    }
    fg.appendChild(span);
    const addButton = HtmlHelpers.buildButton("","+",[CSSClasses.btnAdd, CSSClasses.hidden]);
    fg.appendChild(addButton);
    newFormRow.appendChild(fg);
    return newFormRow;
}

function initializeSoundCueForms(config : SoundCommandList) {
    const mapPanel = document.getElementById(ElementIDs.cueConfigPanel);
    if (!mapPanel) {
        console.error("Unable to locate panel, skipping form initialization.")
        return;
    }
    const rows = config.map(mapCommandToForm);
    mapPanel.append(...rows);
}

function updateSoundCueForms(newConfig : SoundCommandList, oldConfig: SoundCommandList) {
    const mapPanel = document.getElementById(ElementIDs.cueConfigPanel);
    if (!mapPanel) {
        console.error("Unable to locate panel, skipping form update.")
        return;
    }
}

function teardownSoundCueForms() {
    const mapPanel = document.getElementById(ElementIDs.cueConfigPanel);
    if (!mapPanel) {
        console.error("Unable to locate panel, skipping form teardown.")
        return;
    }
}

function onSoundCommandConfigChange(newConfig: SoundCommandList, oldConfig: SoundCommandList) {
    if (!Array.isArray(newConfig))  {
        console.error("No config was provided, skipping form render.")
        return;
    }

    if (newConfig && !oldConfig) {
        // create from scratch
        initializeSoundCueForms(newConfig);
    } else if (newConfig && oldConfig) {
        // update the dom
        updateSoundCueForms(newConfig, oldConfig);
    } else if (!newConfig && oldConfig) {
        // tear down the forms
        teardownSoundCueForms();
    }
};


function setupSoundCueConfigForm(){
    NodeCG.waitForReplicants(CommandConfig, CommandTypes)
    .then(() => {
        CommandConfig.on(ReplicantEvents.change, onSoundCommandConfigChange);
    });
}

document.addEventListener("DOMContentLoaded", setupSoundCueConfigForm);