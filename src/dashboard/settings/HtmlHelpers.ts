import { type CSSClasses } from './types'

function buildDiv (id?: string, classes?: string[]): HTMLDivElement {
  const div = document.createElement('div')
  if ((classes != null) && classes.length > 0) {
    div.classList.add(...classes)
  }
  if (id != null) {
    div.id = id
  }
  return div
}

function buildHiddenInput (name: string, value: string): HTMLInputElement {
  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = name
  input.value = value
  return input
}

function buildButton (name: string, text: string, classes?: string[]): HTMLButtonElement {
  const button = document.createElement('button')
  if ((classes != null) && classes.length > 0) {
    button.classList.add(...classes)
  }
  button.name = name
  button.innerText = text
  return button
}

function buildLabel (forName: string, text: string, classes?: string[]): HTMLLabelElement {
  const label = document.createElement('label')
  if ((classes != null) && classes.length > 0) {
    label.classList.add(...classes)
  }
  label.htmlFor = forName
  label.innerText = text
  return label
}

function buildSpan (text: string, classes?: string[]): HTMLSpanElement {
  const span = document.createElement('span')
  if ((classes != null) && classes.length > 0) {
    span.classList.add(...classes)
  }
  span.innerText = text
  return span
}

function buildTextInput (name: string, value: string, classes?: string[]): HTMLInputElement {
  const input = document.createElement('input')
  if ((classes != null) && classes.length > 0) {
    input.classList.add(...classes)
  }
  input.type = 'text'
  input.name = name
  input.value = value
  return input
}

function buildNumberInput (name: string, value: string, classes?: string[]): HTMLInputElement {
  const input = document.createElement('input')
  if ((classes != null) && classes.length > 0) {
    input.classList.add(...classes)
  }
  input.type = 'number'
  input.name = name
  input.value = value
  return input
}

export interface SelectInputDataElem {
  label: string
  value: string
  selected: boolean
}

function buildSelect (classes: string[], name: string, options: SelectInputDataElem[]): HTMLSelectElement {
  const select = document.createElement('select')
  if (classes != null && classes.length > 0) {
    select.classList.add(...classes)
  }
  select.name = name
  options.forEach((opt) => {
    const o = document.createElement('option')
    o.value = opt.value
    o.innerText = opt.label
    o.selected = opt.selected
    select.add(o)
  })
  return select
}

function buildForm (name: string | null, id: string | null, classes: CSSClasses[]): HTMLFormElement {
  const form = document.createElement('form')
  if (name != null) {
    form.name = name
  }
  if (id != null) {
    form.id = id
  }
  if (classes != null && classes.length > 0) {
    form.classList.add(...classes)
  }
  return form
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
