import CSS from "./jb-input.scss";
import { ValidationItem, ValidationResult, type WithValidation } from 'jb-validation';
import type { JBFormInputStandards } from 'jb-form';
import { ValidationHelper } from 'jb-validation';
import {
  type ElementsObject,
  type JBInputValue,
  type StandardValueCallbackFunc,
  type ValidationValue,
} from "./types";
import { renderHTML } from "./render";
import { createInputEvent, createKeyboardEvent } from "./utils";
export class JBInputWebComponent extends HTMLElement implements WithValidation<ValidationValue>,JBFormInputStandards<string> {
  static get formAssociated() {
    return true;
  }
  #value: JBInputValue = {
    displayValue: "",
    value: ""
  };
  elements!: ElementsObject;
  #disabled = false;
  get disabled(){
    return this.#disabled;
  }
  set disabled(value:boolean){
    this.#disabled = value;
    this.elements.input.disabled = value;
    if(value){
      //TODO: remove as any when typescript support
      (this.#internals as any).states?.add("disabled");
    }else{
      (this.#internals as any).states?.delete("disabled");
    }
  }
  #required = false;
  set required(value:boolean){
    this.#required = value;
    this.#validation.checkValidity(false);
  }
  get required() {
    return this.#required;
  }
  #internals?: ElementInternals;
  /**
 * @description will determine if component trigger jb-validation mechanism automatically on user event or it just let user-developer handle validation mechanism by himself
 */
  get isAutoValidationDisabled(): boolean {
    //currently we only support disable-validation in attribute and only in initiate time but later we can add support for change of this 
    return this.getAttribute('disable-auto-validation') === '' || this.getAttribute('disable-auto-validation') === 'true' ? true : false;
  }
  #checkValidity(showError: boolean) {
    if (!this.isAutoValidationDisabled) {
      return this.#validation.checkValidity(showError);
    }
  }
  #validation = new ValidationHelper<ValidationValue>(this.showValidationError.bind(this), this.clearValidationError.bind(this), () => this.#value, () => this.#value.displayValue, this.#getInsideValidation.bind(this), this.#setValidationResult.bind(this));
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
    if (this.#internals && typeof this.#internals.setFormValue == "function") {
      this.#internals.setFormValue(valueOnj.value);
    }
    this.elements.input.value = valueOnj.displayValue;
  }
  initialValue = "";
  get isDirty(): boolean{
    return this.#value.value !== this.initialValue;
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
  get name(){
    return this.getAttribute('name') || '';
  }
  // end of selection input behavior
  constructor() {
    super();
    if (typeof this.attachInternals == "function") {
      //some browser dont support attachInternals
      this.#internals = this.attachInternals();
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
      "required",
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
          this.disabled = true;
        } else if (value == "false" || value == null || value == undefined) {
          this.disabled = false;
          this.elements.input.removeAttribute("disabled");
        }
        break;
      case "inputmode":
        this.elements.input.setAttribute("inputmode", value);
        break;
      case "required":
        //to update validation result base on new requirement
        this.required = value ? value !== 'false' : false;
        break;
    }
  }


  #onInputKeyDown(e: KeyboardEvent): void {
    this.#dispatchKeydownEvent(e);
  }
  #dispatchKeydownEvent(e: KeyboardEvent) {
    e.stopPropagation();
    //trigger component event
    const event = createKeyboardEvent("keydown",e,{cancelable:true});
    const isPrevented = !this.dispatchEvent(event);
    if (isPrevented) {
      e.preventDefault();
    }
  }
  #onInputKeyPress(e: KeyboardEvent): void {
    e.stopPropagation();
    const event = createKeyboardEvent("keypress",e,{cancelable:false});
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
    const event = createKeyboardEvent("keyup",e,{cancelable:false});
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
    const event = createInputEvent('input',e,{cancelable:true});
    this.dispatchEvent(event);
  }

  #onInputBeforeInput(e: InputEvent): void {
    this.#dispatchBeforeInputEvent(e);
  }
  #dispatchBeforeInputEvent(e: InputEvent): boolean {
    e.stopPropagation();
    const event = createInputEvent('beforeinput',e,{cancelable:true});
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
  #getInsideValidation(): ValidationItem<ValidationValue>[] {
    const validationList: ValidationItem<ValidationValue>[] = [];
    if (this.required) {
      validationList.push({
        validator: /.{1}/g,
        message: this.getAttribute("label") + "میبایست حتما وارد شود",
        stateType: "valueMissing"
      });
    }
    return validationList;
  }
  /**
   * @public
   * @description this method used to check for validity but doesn't show error to user and just return the result
   * this method used by #internal of component
   */
  checkValidity(): boolean {
    const validationResult = this.#validation.checkValidity(false);
    if (!validationResult.isAllValid) {
      const event = new CustomEvent('invalid');
      this.dispatchEvent(event);
    }
    return validationResult.isAllValid;
  }
  /**
  * @public
 * @description this method used to check for validity and show error to user
 */
  reportValidity(): boolean {
    const validationResult = this.#validation.checkValidity(true);
    if (!validationResult.isAllValid) {
      const event = new CustomEvent('invalid');
      this.dispatchEvent(event);
    }
    return validationResult.isAllValid;
  }
  /**
   * @description this method called on every checkValidity calls and update validation result of #internal
   */
  #setValidationResult(result: ValidationResult<ValidationValue>) {
    if (result.isAllValid) {
      this.#internals.setValidity({}, '');
    } else {
      const states: ValidityStateFlags = {};
      let message = "";
      result.validationList.forEach((res) => {
        if (!res.isValid) {
          if (res.validation.stateType) { states[res.validation.stateType] = true; }
          if (message == '') { message = res.message; }
        }
      });
      this.#internals.setValidity(states, message);
    }
  }
  get validationMessage(){
    return this.#internals.validationMessage;
  }
}
const myElementNotExists = !customElements.get("jb-input");
if (myElementNotExists) {
  window.customElements.define("jb-input", JBInputWebComponent);
}
