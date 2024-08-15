import CSS from "./jb-input.scss";
import { ValidationResult, WithValidation } from 'jb-validation/types';
import { ValidationHelper } from 'jb-validation';
import {
  type ElementsObject,
  type JBInputValue,
  StandardValueCallbackFunc,
  ValidationValue,
} from "./types";
import { renderHTML } from "./render";

export class JBInputWebComponent extends HTMLElement implements WithValidation<ValidationValue> {
  static get formAssociated() {
    return true;
  }
  #value: JBInputValue = {
    displayValue: "",
    value: ""
  };
  elements!: ElementsObject;
  #disabled = false;
  internals_?: ElementInternals;
  /**
 * @description will determine if component trigger jb-validation mechanism automatically on user event or it just let user-developer handle validation mechanism by himself
 */
  get isAutoValidationDisabled(): boolean {
    //currently we only support disable-validation in attribute and only in initiate time but later we can add support for change of this 
    return this.getAttribute('disable-auto-validation') === '' || this.getAttribute('disable-auto-validation') === 'true' ? true : false;
  }
  #checkValidity(showError:boolean){
    if(!this.isAutoValidationDisabled){
      return this.#validation.checkValidity(showError);
    }
  }
  #validation = new ValidationHelper<ValidationValue>(this.showValidationError.bind(this), this.clearValidationError.bind(this), () => this.#value, () => this.#value.displayValue, () => []);
  get validation() {
    return this.#validation;
  }
  get displayValue() {
    return this.#value.displayValue;
  }
  get value(): string {
    //do not write any logic or task here this function will be overrides by other inputs like mobile input or payment input 
    return this.#value.value;
  }
  set value(value: string) {
    //do not write any logic or task here this function will be overrides by other inputs like mobile input or payment input 
    this.#setValue(value);
  }
  #setValue(value: string) {
    const standardValue = this.standardValue(value);
    this.#setValueByObject(standardValue);
  }
  #setValueByObject(valueOnj: JBInputValue) {
    this.#value = valueOnj;
    //comment for typescript problem
    if (this.internals_ && typeof this.internals_.setFormValue == "function") {
      this.internals_.setFormValue(valueOnj.value);
    }
    this.elements.input.value = valueOnj.displayValue;
  }
  //selection input behavior
  get selectionStart(): number {
    return this.elements.input.selectionStart;
  }
  set selectionStart(value: number) {
    this.elements.input.selectionStart = value;
  }
  get selectionEnd(): number {
    return this.elements.input.selectionEnd;
  }
  set selectionEnd(value: number) {
    this.elements.input.selectionEnd = value;
  }
  get selectionDirection(): "forward" | "backward" | "none" {
    return this.elements.input.selectionDirection;
  }
  set selectionDirection(value: "forward" | "backward" | "none") {
    this.elements.input.selectionDirection = value;
  }
  // end of selection input behavior
  constructor() {
    super();
    if (typeof this.attachInternals == "function") {
      //some browser dont support attachInternals
      this.internals_ = this.attachInternals();
    }
    this.#initWebComponent();
  }
  connectedCallback(): void {
    // standard web component event that called when all of dom is banded
    this.#callOnLoadEvent();
    this.initProp();
    this.#callOnInitEvent();
  }
  #callOnLoadEvent(): void {
    const event = new CustomEvent("load", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #callOnInitEvent(): void {
    const event = new CustomEvent("init", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #initWebComponent(): void {
    const shadowRoot = this.attachShadow({
      mode: "open",
      delegatesFocus: true,
    });
    this.#render();
    this.elements = {
      input: shadowRoot.querySelector(".input-box input")!,
      inputBox: shadowRoot.querySelector(".input-box")!,
      label: shadowRoot.querySelector("label")!,
      labelValue: shadowRoot.querySelector("label .label-value")!,
      messageBox: shadowRoot.querySelector(".message-box")!,
      slots: {
        startSection: shadowRoot.querySelector(".jb-input-start-section-wrapper slot")!,
        endSection: shadowRoot.querySelector(".jb-input-end-section-wrapper slot")!
      }
    };
    this.#registerEventListener();
  }
  #render() {
    const html = `<style>${CSS}</style>` + "\n" + renderHTML();
    const element = document.createElement("template");
    element.innerHTML = html;
    this.shadowRoot.appendChild(element.content.cloneNode(true));
  }
  #standardValueCallbacks: StandardValueCallbackFunc[] = []
  addStandardValueCallback(func: StandardValueCallbackFunc) {
    this.#standardValueCallbacks.push(func);
  }
  /**
   * @description this function will get user inputted or pasted text and convert it to standard one base on developer config
   */
  standardValue(valueString: string | number): JBInputValue {
    let standardValue: JBInputValue = {
      displayValue: valueString.toString(),
      value: valueString.toString(),
    };
    standardValue = this.#standardValueCallbacks.reduce((acc, func) => {
      const res = func(valueString.toString(), this.#value, acc);
      return res;
    }, standardValue);
    return standardValue;
  }

  #registerEventListener(): void {
    this.elements.input.addEventListener("change", (e: Event) => this.#onInputChange(e));
    this.elements.input.addEventListener("beforeinput", this.#onInputBeforeInput.bind(this));
    this.elements.input.addEventListener("input", (e) => this.#onInputInput(e as InputEvent));
    this.elements.input.addEventListener("keypress", this.#onInputKeyPress.bind(this));
    this.elements.input.addEventListener("keyup", this.#onInputKeyup.bind(this));
    this.elements.input.addEventListener("keydown", this.#onInputKeyDown.bind(this));
  }
  initProp() {
    this.#disabled = false;
    this.value = this.getAttribute("value") || "";
  }
  static get observedAttributes(): string[] {
    return [
      "label",
      "type",
      "message",
      "value",
      "name",
      "autocomplete",
      "placeholder",
      "disabled",
      "inputmode",
      'disable-auto-validation',
    ];
  }
  //please do not add any other functionality in this func because it may override by enstatite d component
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    // do something when an attribute has changed
    this.onAttributeChange(name, newValue);
  }
  protected onAttributeChange(name: string, value: string): void {
    switch (name) {
      case "label":
        this.elements.labelValue.innerHTML = value;
        if (value == null || value == undefined || value == "") {
          this.elements.label.classList.add("--hide");
        } else {
          this.elements.label.classList.remove("--hide");
        }
        break;
      case "type":
        this.elements.input.setAttribute("type", value);
        if (value == "number") {
          if (this.getAttribute("inputmode") == null) {
            this.setAttribute("inputmode", "numeric");
          }
        }
        break;
      case "message":
        this.elements.messageBox.innerHTML = value;
        break;
      case "value":
        this.value = value;
        break;
      case "name":
        this.elements.input.setAttribute("name", value);
        break;
      case "autocomplete":
        this.elements.input.setAttribute("autocomplete", value);
        break;
      case "placeholder":
        this.elements.input.placeholder = value;
        break;
      case "disabled":
        if (value == "" || value === "true") {
          this.#disabled = true;
          this.elements.input.setAttribute("disabled", "true");
        } else if (value == "false" || value == null || value == undefined) {
          this.#disabled = false;
          this.elements.input.removeAttribute("disabled");
        }
        break;
      case "inputmode":
        this.elements.input.setAttribute("inputmode", value);
    }
  }


  #onInputKeyDown(e: KeyboardEvent): void {
    this.#dispatchKeydownEvent(e);
  }
  #dispatchKeydownEvent(e: KeyboardEvent) {
    e.stopPropagation();
    //trigger component event
    const keyDownInitObj: KeyboardEventInit = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which,
      cancelable: true,
      bubbles: e.bubbles,
      composed: e.composed,
      detail: e.detail,
      isComposing: e.isComposing,
      location: e.location,
      metaKey: e.metaKey,
      repeat: e.repeat,
      view: e.view
    };
    const event = new KeyboardEvent("keydown", keyDownInitObj);
    const isPrevented = !this.dispatchEvent(event);
    if (isPrevented) {
      e.preventDefault();
    }
  }
  #onInputKeyPress(e: KeyboardEvent): void {
    e.stopPropagation();
    const keyPressInitObj: KeyboardEventInit = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which,
      isComposing: e.isComposing,
      cancelable: e.cancelable,
      bubbles: e.bubbles,
      composed: e.composed,
    };
    const event = new KeyboardEvent("keypress", keyPressInitObj);
    this.dispatchEvent(event);
  }
  #onInputKeyup(e: KeyboardEvent): void {
    this.#dispatchKeyupEvent(e);
    if (e.keyCode == 13) {
      this.#onInputEnter();
    }
  }
  #dispatchKeyupEvent(e: KeyboardEvent) {
    e.stopPropagation();
    const keyUpInitObj = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which,
    };
    const event = new KeyboardEvent("keyup", keyUpInitObj);
    this.dispatchEvent(event);
  }
  #onInputEnter(): void {
    const event = new KeyboardEvent("enter");
    this.dispatchEvent(event);
  }
  /**
   *
   * @param {InputEvent} e
   */
  #onInputInput(e: InputEvent): void {
    const endCaretPos = (e.target as HTMLInputElement).selectionEnd || 0;
    const startCaretPos = (e.target as HTMLInputElement).selectionStart || 0;
    const inputText = (e.target as HTMLInputElement).value;
    const target = (e.target as HTMLInputElement);
    //to standard value again
    this.value = inputText;
    //if user type in middle of text we will return the caret position to the middle of text because this.value = inputText will move caret to end
    if (endCaretPos != inputText.length) {
      //because number input does not support setSelectionRange
      if (!['number'].includes(this.getAttribute('type'))) {
        target.setSelectionRange(endCaretPos, endCaretPos);
      }

    }
    //e.target.setSelectionRange(startCaretPos + e.data, endCaretPos);
    this.#checkValidity(false);
    this.#dispatchOnInputEvent(e);
  }
  #dispatchOnInputEvent(e: InputEvent): void {
    e.stopPropagation();
    const eventInitDict: InputEventInit = {
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      composed: e.composed,
      data: e.data,
      isComposing: e.isComposing,
      inputType: e.inputType,
      dataTransfer: e.dataTransfer,
      view: e.view,
      detail: e.detail,
      targetRanges: e.getTargetRanges(),
    };
    const event = new InputEvent("input", eventInitDict);
    this.dispatchEvent(event);
  }

  #onInputBeforeInput(e: InputEvent): void {
    this.#dispatchBeforeInputEvent(e);
  }
  #dispatchBeforeInputEvent(e: InputEvent): boolean {
    e.stopPropagation();
    const eventInitDict: InputEventInit = {
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      composed: e.composed,
      data: e.data,
      isComposing: e.isComposing,
      inputType: e.inputType,
      dataTransfer: e.dataTransfer,
      view: e.view,
      detail: e.detail,
      targetRanges: e.getTargetRanges(),
    };
    const event = new InputEvent("beforeinput", eventInitDict);
    this.dispatchEvent(event);
    if (event.defaultPrevented) {
      e.preventDefault();
    }
    return event.defaultPrevented;
  }
  #onInputChange(e: Event): void {
    const inputText = (e.target as HTMLInputElement).value;
    //here is the rare  time we update value directly because we want trigger event that may read value directly from dom
    const oldValue = this.#value;
    this.value = inputText;
    this.#checkValidity(true);
    const isCanceled = this.#dispatchOnChangeEvent(e);
    if (isCanceled) {
      this.#value = oldValue;
      e.preventDefault();
    }
  }
  #dispatchOnChangeEvent(e: Event): boolean {
    e.stopPropagation();
    const eventInit: EventInit = {
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      composed: e.composed
    };
    const event = new Event("change", eventInit);
    this.dispatchEvent(event);
    if (event.defaultPrevented) {
      return true;
    }
    return false;
  }

  showValidationError(error: string) {
    this.elements.messageBox.innerHTML = error;
    this.elements.messageBox.classList.add("error");
  }
  clearValidationError() {
    const text = this.getAttribute("message") || "";
    this.elements.messageBox.innerHTML = text;
    this.elements.messageBox.classList.remove("error");
  }
  /**
   * @public
   */
  focus() {
    //public method
    this.elements.input.focus();
  }
  setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none") {
    this.elements.input.setSelectionRange(start, end, direction);
  }
}
const myElementNotExists = !customElements.get("jb-input");
if (myElementNotExists) {
  window.customElements.define("jb-input", JBInputWebComponent);
}
