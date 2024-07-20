import CSS from "./jb-input.scss";
import "./inbox-element/inbox-element.js";
import {ValidationItem,ValidationResult,ValidationResultItem, ValidationResultSummary,WithValidation} from '../../../common/scripts/validation/validation-helper-types';
export {ValidationItem, ValidationResultItem, ValidationResultSummary};
import {ValidationHelper} from '../../../common/scripts/validation/validation-helper';
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
  #value:JBInputValue = {
    displayValue:"",
    value:""
  };
  elements!: ElementsObject;
  
  #disabled = false;
  internals_?: ElementInternals;
  #validation = new ValidationHelper<ValidationValue>(this.showValidationError.bind(this),this.clearValidationError.bind(this),()=>this.#value,()=>this.#value.displayValue,()=>[]);
  get validation(){
    return this.#validation;
  }
  get value(): string {
    //do not write any logic or task here this function will be overrides by other inputs like mobile input or payment input 
    return this.#value.value;
  }
  set value(value: string) {
    //do not write any logic or task here this function will be overrides by other inputs like mobile input or payment input 
    this.#setValue(value);
  }
  #setValue(value: string){
    const standardValue = this.standardValue(value);
    this.#setValueByObject(standardValue);
  }
  #setValueByObject(valueOnj:JBInputValue){
    this.#value = valueOnj;
    //comment for typescript problem
    if (this.internals_ && typeof this.internals_.setFormValue == "function") {
      this.internals_.setFormValue(valueOnj.value);
    }
    this.elements.input.value = valueOnj.displayValue;
  }
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
      slots:{
        startSection:shadowRoot.querySelector(".jb-input-start-section-wrapper slot")!,
        endSection:shadowRoot.querySelector(".jb-input-end-section-wrapper slot")!
      }
    };
    this.#registerEventListener();
  }
  #render(){
    const html = `<style>${CSS}</style>` + "\n" + renderHTML();
    const element = document.createElement("template");
    element.innerHTML = html;
    this.shadowRoot.appendChild(element.content.cloneNode(true));
  }
  #standardValueCallbacks:StandardValueCallbackFunc[] = []
  addStandardValueCallback(func:StandardValueCallbackFunc){
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
    standardValue = this.#standardValueCallbacks.reduce((acc,func)=>{
      const res = func(valueString.toString(),this.#value,acc);
      return res;
    },standardValue);
    return standardValue;
  }

  #registerEventListener(): void {
    this.elements.input.addEventListener("change", (e:Event) =>this.#onInputChange(e));
    this.elements.input.addEventListener("beforeinput",this.#onInputBeforeInput.bind(this));
    this.elements.input.addEventListener("input", (e) =>this.#onInputInput(e as InputEvent));
    this.elements.input.addEventListener("keypress",this.#onInputKeyPress.bind(this));
    this.elements.input.addEventListener("keyup", this.#onInputKeyup.bind(this));
    this.elements.input.addEventListener("keydown",this.#onInputKeyDown.bind(this));
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
    ];
  }
  //please do not add any other functionality in this func because it may override by enstatite d component
  attributeChangedCallback(name: string,oldValue: string,newValue: string): void {
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
  #dispatchKeydownEvent(e: KeyboardEvent){
    //trigger component event
    const keyDownInitObj:KeyboardEventInit = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which,
      //TODO: make event cancelable
      cancelable:false,
      bubbles:e.bubbles,
      composed:e.composed,
      detail:e.detail,
      isComposing:e.isComposing,
      location:e.location,
      metaKey:e.metaKey,
      repeat:e.repeat,
      view:e.view
    };
    const event = new KeyboardEvent("keydown", keyDownInitObj);
    this.dispatchEvent(event);
  }
  #onInputKeyPress(e: KeyboardEvent): void {
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
    if (e.keyCode == 13) {
      this.#onInputEnter();
    }
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
    //to standard value again
    this.value = inputText;
    //if user type in middle of text we will return the caret position to the middle of text because this.value = inputText will move caret to end
    if (endCaretPos != inputText.length) {
      (e.target as HTMLInputElement).setSelectionRange(
        endCaretPos,
        endCaretPos
      );
    }
    //e.target.setSelectionRange(startCaretPos + e.data, endCaretPos);
    this.#validation.checkValidity(false);
    this.#dispatchOnInputEvent(e);
  }
  #dispatchOnInputEvent(e: InputEvent): void {
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
    const eventInitDict:InputEventInit = {
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
    this.#validation.checkValidity(true);
    const isCanceled = this.#dispatchOnChangeEvent(e);
    if(isCanceled){
      this.#value = oldValue;
      e.preventDefault();
    }
  }
  #dispatchOnChangeEvent(e: Event): boolean {
    const eventInit:EventInit = {
      bubbles: e.bubbles,
      cancelable:e.cancelable,
      composed:e.composed
    };
    const event = new Event("change",eventInit);
    this.dispatchEvent(event);
    if(event.defaultPrevented){
      return true;
    }
    return false;
  }
  /**
   * @deprecated 
   */
  triggerInputValidation(showError = true): ValidationResult<ValidationValue>{
    return this.#validation.checkValidity(showError);
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
}
const myElementNotExists = !customElements.get("jb-input");
if (myElementNotExists) {
  window.customElements.define("jb-input", JBInputWebComponent);
}
