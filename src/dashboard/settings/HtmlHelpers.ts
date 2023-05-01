function buildDiv(id?: string, classes?: string[]) {
    const div = document.createElement("div") as HTMLDivElement;
    if (classes && classes.length > 0){
        div.classList.add(...classes);
    }
    if (id) {
        div.id = id;
    }
    return div;
}

function buildHiddenInput(name: string, value: string) {
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
}

function buildButton(name : string, text: string, classes?: string[], ) {
    const button = document.createElement("button") as HTMLButtonElement;
    if (classes && classes.length > 0){
        button.classList.add(...classes);
    }
    button.name = name;
    button.innerText = text;
    return button;
}

function buildLabel(forName: string, text: string, classes?: string[]) {
    const label = document.createElement("label") as HTMLLabelElement;
    if (classes && classes.length > 0){
        label.classList.add(...classes);
    }
    label.htmlFor = forName;
    label.innerText = text;
    return label;
}

function buildSpan(text: string, classes?: string[]) {
    const span = document.createElement("span") as HTMLSpanElement;
    if (classes && classes.length > 0){
        span.classList.add(...classes);
    }
    span.innerText = text;
    return span;
}

function buildTextInput(name: string, value: string, classes?: string[]) {
    const input = document.createElement("input") as HTMLInputElement;
    if (classes && classes.length > 0){
        input.classList.add(...classes);
    }
    input.type = "text";
    input.name = name;
    input.value = value;
    return input;
}

function buildNumberInput(name: string, value: string, classes?: string[]) {
    const input = document.createElement("input") as HTMLInputElement;
    if (classes && classes.length > 0){
        input.classList.add(...classes);
    }
    input.type = "number";
    input.name = name;
    input.value = value;
    return input;
}

export type SelectInputDataElem = {
    label: string;
    value: string;
    selected: boolean;
}

function buildSelect(classes : string[], name: string, options: SelectInputDataElem[]){
    const select = document.createElement("select") as HTMLSelectElement;
    if (classes && classes.length > 0){
       select.classList.add(...classes);
    }
    select.name = name;
    options.forEach((opt) => {
        const o = document.createElement("option") as HTMLOptionElement;
        o.value = opt.value;
        o.innerText = opt.label;
        o.selected = opt.selected;
        select.add(o);
    })
    return select;
}

function buildForm(name: string | null, id: string | null, classes: CSSClasses[]) {
    const form = document.createElement("form") as HTMLFormElement;
    if (name) {
        form.name = name;
    }
    if (id) {
        form.id = id;
    }
    if (classes && classes.length > 0) {
        form.classList.add(...classes);
    }
    return form;
}


export default {
    buildButton,
    buildLabel,
    buildTextInput,
    buildSelect,
    buildHiddenInput,
    buildSpan,
    buildDiv,
    buildNumberInput,
    buildForm
}