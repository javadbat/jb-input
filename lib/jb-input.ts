import HTML from "./jb-input.html";
import CSS from "./jb-input.scss";
import NumberInputButtonsHTML from "./number-input-buttons.html";
import "./inbox-element/inbox-element.js";
import {ValidationItem,ValidationResult,ValidationResultItem, ValidationResultSummary,WithValidation} from '../../../common/scripts/validation/validation-helper-types';
export {ValidationItem, ValidationResultItem, ValidationResultSummary};
import {ValidationHelper} from '../../../common/scripts/validation/validation-helper';
import { 
  type ElementsObject,
  type JBInputValue,
  type NumberFieldParameter,
  type NumberFieldParameterInput,
  StandardValueCallbackFunc,
  ValidationValue,
} from "./types";
import { standardValueForNumberInput } from "./utils";

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
  numberFieldParameters: NumberFieldParameter = {
    //if input type is number we use this step to change value on +- clicks
    step: 1,
    maxValue: null,
    minValue: null,
    //how many decimal  place we accept
    decimalPrecision: null,
    //if user type or paste something not a number, this char will be filled the replacement in most cases will be '0'
    invalidNumberReplacement: "",
    //for money and big number separate with a comma
    useThousandSeparator: false,
    thousandSeparator: ",",
    acceptNegative: true,
    showButtons: true,
    //will show persian number even if user type en number but value will be passed as en number
    showPersianNumber: false,
  };
  #validation = new ValidationHelper<ValidationValue>(this.showValidationError.bind(this),this.clearValidationError.bind(this),()=>this.#value,()=>this.#value.displayValue,()=>[]);
  get validation(){
    return this.#validation;
  }
  isPasswordVisible: boolean | undefined;
  increaseNumber?: () => void;
  decreaseNumber?: () => void;
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
    // standard web component event that called when all of dom is binded
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
    const html = `<style>${CSS}</style>` + "\n" + HTML;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      input: shadowRoot.querySelector(".input-box input")!,
      inputBox: shadowRoot.querySelector(".input-box")!,
      label: shadowRoot.querySelector("label")!,
      labelValue: shadowRoot.querySelector("label .label-value")!,
      messageBox: shadowRoot.querySelector(".message-box")!,
      passwordTrigger: shadowRoot.querySelector(".password-trigger")!,
    };
    this.#registerEventListener();
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
    //TODO: move this number check to a call back function and add it in that scenario
    if (typeof valueString !== "string") {
      if (typeof valueString === "number") {
        if (!isNaN(valueString)) {
          valueString = `${valueString}`;
        } else {
          valueString = this.numberFieldParameters
            ? this.numberFieldParameters.invalidNumberReplacement
            : "";
        }
      } else {
        valueString = this.numberFieldParameters
          ? this.numberFieldParameters.invalidNumberReplacement
          : "";
      }
    }
    if (this.getAttribute("type") == "number") {
      standardValue = this.standardValueForNumberInput(valueString.toString());
    }
    return standardValue;
  }
  standardValueForNumberInput(
    inputValueString: string
  ): JBInputValue {
    return standardValueForNumberInput(
      inputValueString,
      this.numberFieldParameters
    );
  }
  #registerEventListener(): void {
    this.elements.input.addEventListener("change", (e:Event) =>
      this.onInputChange(e)
    );
    this.elements.input.addEventListener(
      "beforeinput",
      this.onInputBeforeInput.bind(this)
    );
    this.elements.input.addEventListener("input", (e) =>
      this.onInputInput(e as InputEvent)
    );
    this.elements.input.addEventListener(
      "keypress",
      this.onInputKeyPress.bind(this)
    );
    this.elements.input.addEventListener("keyup", this.onInputKeyup.bind(this));
    this.elements.input.addEventListener(
      "keydown",
      this.onInputKeyDown.bind(this)
    );
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
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    // do something when an attribute has changed
    this.onAttributeChange(name, newValue);
  }
  onAttributeChange(name: string, value: string): void {
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
        if (value !== "number") {
          //we handle number manually
          this.elements.input.setAttribute("type", value);
        }
        if (value == "password") {
          this.initPassword();
        }
        if (value == "number") {
          if (this.getAttribute("inputmode") == null) {
            this.setAttribute("inputmode", "numeric");
          }
          this.initNumberField();
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
  initPassword(): void {
    this.elements.inputBox.classList.add("type-password");
    this.isPasswordVisible = false;
    this.elements.passwordTrigger.addEventListener(
      "click",
      this.onPasswordTriggerClicked.bind(this)
    );
  }
  /**
   * @public
   * change number input config base on developer need
   * @param {NumberFieldParameterInput} numberFieldParameters
   */
  setNumberFieldParameter(
    numberFieldParameters: NumberFieldParameterInput
  ): void {
    if (numberFieldParameters.step && !isNaN(numberFieldParameters.step)) {
      this.numberFieldParameters!.step = numberFieldParameters.step;
    }
    if (
      numberFieldParameters &&
      numberFieldParameters.decimalPrecision !== null &&
      numberFieldParameters.decimalPrecision !== undefined &&
      !isNaN(numberFieldParameters.decimalPrecision)
    ) {
      this.numberFieldParameters!.decimalPrecision =
        numberFieldParameters.decimalPrecision;
    }
    if (
      numberFieldParameters &&
      numberFieldParameters.invalidNumberReplacement
    ) {
      this.numberFieldParameters!.invalidNumberReplacement =
        numberFieldParameters.invalidNumberReplacement;
    }
    if (
      numberFieldParameters &&
      typeof numberFieldParameters.useThousandSeparator == "boolean"
    ) {
      this.numberFieldParameters!.useThousandSeparator =
        numberFieldParameters.useThousandSeparator;
    }
    if (
      numberFieldParameters &&
      typeof numberFieldParameters.thousandSeparator == "string"
    ) {
      this.numberFieldParameters!.thousandSeparator =
        numberFieldParameters.thousandSeparator;
    }
    if (
      numberFieldParameters &&
      typeof numberFieldParameters.acceptNegative == "boolean"
    ) {
      this.numberFieldParameters!.acceptNegative =
        numberFieldParameters.acceptNegative;
    }
    if (
      numberFieldParameters &&
      typeof numberFieldParameters.maxValue == "number"
    ) {
      this.numberFieldParameters.maxValue = numberFieldParameters.maxValue;
    }
    if (
      numberFieldParameters &&
      typeof numberFieldParameters.minValue == "number"
    ) {
      this.numberFieldParameters.minValue = numberFieldParameters.minValue;
    }
    if (
      numberFieldParameters &&
      numberFieldParameters.showButtons !== undefined
    ) {
      if (numberFieldParameters.showButtons === false) {
        this.removeNumberInputButtons();
      } else {
        this.addNumberInputButtons();
      }
    }
    if (
      numberFieldParameters &&
      typeof numberFieldParameters.showPersianNumber == "boolean"
    ) {
      this.numberFieldParameters.showPersianNumber =
        numberFieldParameters.showPersianNumber;
    }
    this.value = `${this.value}`;
  }
  onPasswordTriggerClicked(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    const textField = this.elements.input;
    const passwordTriggerSVG =
      this.elements.passwordTrigger.querySelector("svg")!;
    if (this.isPasswordVisible) {
      passwordTriggerSVG.classList.add("password-visible");
      textField.setAttribute("type", "text");
    } else {
      passwordTriggerSVG.classList.remove("password-visible");
      textField.setAttribute("type", "password");
    }
  }
  /**
   *
   * @param {KeyboardEvent} e
   */
  onInputKeyDown(e: KeyboardEvent): void {
    //handle up and down on number key
    if (this.getAttribute("type") == "number") {
      const key = e.key;
      if (key == "ArrowUp") {
        this.increaseNumber!();
        e.preventDefault();
      }
      if (key == "ArrowDown") {
        this.decreaseNumber!();
        e.preventDefault();
      }
    }
    //trigger component event
    const keyDownInitObj = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which,
    };
    const event = new KeyboardEvent("keydown", keyDownInitObj);
    this.dispatchEvent(event);
  }
  onInputKeyPress(e: KeyboardEvent): void {
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
  onInputKeyup(e: KeyboardEvent): void {
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
      this.onInputEnter();
    }
  }
  onInputEnter(): void {
    const event = new CustomEvent("enter");
    this.dispatchEvent(event);
  }
  /**
   *
   * @param {InputEvent} e
   */
  onInputInput(e: InputEvent): void {
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
    this.dispatchOnInputEvent(e);
  }
  dispatchOnInputEvent(e: InputEvent): void {
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
  /**
   * check if string value is a number
   * @param {string} value
   * @return {boolean}
   */
  private isStringIsNumber(value: string | null): boolean {
    if (value == null || value == undefined || value.trim().length == 0) {
      return false;
    } else {
      let isNumber = !isNaN(Number(value));
      if (!isNumber) {
        const replacedNumberValue = value
          .replace(/\u06F0/g, "0")
          .replace(/\u06F1/g, "1")
          .replace(/\u06F2/g, "2")
          .replace(/\u06F3/g, "3")
          .replace(/\u06F4/g, "4")
          .replace(/\u06F5/g, "5")
          .replace(/\u06F6/g, "6")
          .replace(/\u06F7/g, "7")
          .replace(/\u06F8/g, "8")
          .replace(/\u06F9/g, "9");
        isNumber = !isNaN(Number(replacedNumberValue));
      }
      return isNumber;
    }
  }
  /**
   *
   * @param {InputEvent} e
   */
  onInputBeforeInput(e: InputEvent): void {
    const endCaretPos = (e.target as HTMLInputElement).selectionEnd || 0;
    const startCaretPos = (e.target as HTMLInputElement).selectionStart || 0;
    let isPreventDefault = false;
    // we check number input type field and prevent non number values
    if (
      this.getAttribute("type") == "number" &&
      e.inputType !== "deleteContentBackward" &&
      !this.isStringIsNumber(e.data)
    ) {
      isPreventDefault = true;
      // we made exception for . char if its valid by user
      if (
        e.data == "." &&
        this.numberFieldParameters!.decimalPrecision !== 0 &&
        this.value.indexOf(".") == -1 &&
        !(endCaretPos == 0 || startCaretPos == 0) &&
        !(
          this.numberFieldParameters!.decimalPrecision !== null &&
          this.value.substring(endCaretPos).length >
            this.numberFieldParameters!.decimalPrecision
        )
      ) {
        isPreventDefault = false;
      }
      //for '-' char we check if negetive number is allowed
      if (
        this.numberFieldParameters &&
        this.numberFieldParameters.acceptNegative &&
        e.data == "-" &&
        (startCaretPos == 0 || endCaretPos == 0)
      ) {
        isPreventDefault = false;
      }
    }
    if (isPreventDefault) {
      e.preventDefault();
    }
    this.#dispatchBeforeInputEvent(e);
  }
  #dispatchBeforeInputEvent(e: InputEvent): boolean {
    const eventInitDict = {
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
  onInputChange(e: Event): void {
    const inputText = (e.target as HTMLInputElement).value;
    const validationResult = this.#validation.checkValidity(true);
    //here is the rare  time we update _value directly because we want trigger event that may read value directly from dom
    this.value = inputText;
    this.#dispatchOnChangeEvent(validationResult);
  }
  #dispatchOnChangeEvent(validationObject:ValidationResult<ValidationValue>): void {
    const event = new CustomEvent("change", {
      detail: {
        isValid: validationObject.isAllValid,
        validationObject: validationObject,
      },
    });
    this.dispatchEvent(event);
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
  initNumberField() {
    const addFloatNumber = (num1: number, num2: number) => {
      const prec1 = `${num1}`.split(".")[1];
      const prec2 = `${num2}`.split(".")[1];
      const zarib1 = prec1 ? Math.pow(10, prec1.length + 1) : 1;
      const zarib2 = prec2 ? Math.pow(10, prec2.length + 1) : 1;
      const zarib = Math.max(zarib1, zarib2);
      const stNum1 = num1 * zarib;
      const stNum2 = num2 * zarib;
      const res = stNum1 + stNum2;
      return res / zarib;
    };
    this.increaseNumber = () => {
      const currentNumber = parseFloat(this.value);
      if (isNaN(currentNumber)) {
        return;
      }
      const step = this.numberFieldParameters
        ? this.numberFieldParameters.step
        : 1;
      const newNumber = addFloatNumber(currentNumber, step);
      this.value = `${newNumber}`;
      const validationResult = this.#validation.checkValidity(true);
      this.#dispatchOnChangeEvent(validationResult);
    };
    this.decreaseNumber = () => {
      const currentNumber = parseFloat(this.value);
      if (isNaN(currentNumber)) {
        return;
      }
      const step = this.numberFieldParameters
        ? this.numberFieldParameters.step
        : 1;
      let newNumber = addFloatNumber(currentNumber, -1 * step);
      if (
        newNumber < 0 &&
        !(
          this.numberFieldParameters &&
          this.numberFieldParameters.acceptNegative
        )
      ) {
        newNumber = 0;
      }
      this.value = `${newNumber}`;
      const validationResult = this.validation.checkValidity(true);
      this.#dispatchOnChangeEvent(validationResult);
    };
    //if user set type="number" attribute
    this.elements.inputBox.classList.add("--type-number");
    const buttonsElement = document.createElement("div");
    buttonsElement.classList.add("number-control-wrapper");
    buttonsElement.innerHTML = NumberInputButtonsHTML;
    buttonsElement
      .querySelector(".increase-number-button")!
      .addEventListener("click", this.increaseNumber.bind(this));
    buttonsElement
      .querySelector(".decrease-number-button")!
      .addEventListener("click", this.decreaseNumber.bind(this));
    this.elements.inputBox.appendChild(buttonsElement);
    this.value = `${this.value}`;
  }
  removeNumberInputButtons() {
    //when user want number input but without any + - button
    this.elements.inputBox.classList.add("--without-number-button");
  }
  addNumberInputButtons() {
    //when user want number input but without any + - button
    this.elements.inputBox.classList.remove("--without-number-button");
  }
}
const myElementNotExists = !customElements.get("jb-input");
if (myElementNotExists) {
  window.customElements.define("jb-input", JBInputWebComponent);
}
