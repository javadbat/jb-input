import { number } from 'prop-types';
import HTML from './JBInput.html';
import CSS from './JBInput.scss';
import NumberInputButtonsHTML from './NumberInputButtons.html';
import './inbox-element/inbox-element';
class JBInputWebComponent extends HTMLElement {
    static get formAssociated() { return true; }
    get value() {
        return this._value;
    }
    set value(value) {
        const standardedValue = this.standardValue(value);
        this._value = standardedValue;
        if (this.internals_ && typeof this.internals_.setFormValue == "function") {
            this.internals_.setFormValue(standardedValue);
        }
        this.elements.input.value = standardedValue;
    }
    get validationList() {
        return this._validationList;
    }
    set validationList(value) {
        this._validationList = value;
        this.triggerInputValidation(false);
    }
    #disabled
    constructor() {
        super();
        if (typeof this.attachInternals == "function") {
            //some browser dont support attachInternals
            this.internals_ = this.attachInternals();
        }
        this.initWebComponent();
    }
    connectedCallback() {
        // standard web component event that called when all of dom is binded
        this.callOnLoadEvent();
        this.initProp();
        this.callOnInitEvent();

    }
    callOnLoadEvent() {
        var event = new CustomEvent('load', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    callOnInitEvent() {
        var event = new CustomEvent('init', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    initWebComponent() {
        this._shadowRoot = this.attachShadow({
            mode: 'open',
            delegatesFocus: true,
        });
        const html = `<style>${CSS}</style>` + '\n' + HTML;
        const element = document.createElement('template');
        element.innerHTML = html;
        this._shadowRoot.appendChild(element.content.cloneNode(true));
        this.elements = {
            input: this._shadowRoot.querySelector('.input-box input'),
            inputBox: this.shadowRoot.querySelector('.input-box')
        };
        this.registerEventListener();
    }

    /**
     * this function will get user inputed or pasted text and convert it to standard one base on developer config
     * @param {String} valueString 
     * @return {String} standard value
     */
    standardValue(valueString) {
        let standardedValue = valueString;
        if (this.getAttribute('type') == "number") {
            standardedValue = this.standardValueForNumberInput(`${standardedValue}`);
        }
        return standardedValue;
    }
    /**
     * 
     * @param {String} valueString 
     * @return {String} standard value
     */
    standardValueForNumberInput(valueString) {
        //if our input type is number and user want to set it to new value we do nececcery logic here
        let value = parseFloat(valueString);
        if (isNaN(value)) {
            //we change nothing
            valueString = this.numberFieldParameters.invalidNumberReplacement;
        }
        //TODO: add max and min checker to prevent bigger value assignment
        // if(value> this.numberFieldParameters.maxValue){
        //     return `${this.numberFieldParameters.maxValue}`;
        // }
        // if(value< this.numberFieldParameters.minValue){
        //     return `${this.numberFieldParameters.minValue}`;
        // }
        const decimalNums = valueString.split('.')[1];
        const decimalPrecisionCount = decimalNums ? decimalNums.length : 0;
        if (!(this.numberFieldParameters.decimalPrecision === null || this.numberFieldParameters.decimalPrecision == undefined) && decimalPrecisionCount && decimalPrecisionCount > this.numberFieldParameters.decimalPrecision) {
            // truncate extra decimal
            const checkRegex = new RegExp(`^-?\\d+(?:\\.\\d{0,${this.numberFieldParameters.decimalPrecision}})?`);
            valueString = valueString.match(checkRegex)[0];
        }
        return valueString;
    }
    registerEventListener() {
        this.elements.input.addEventListener('change', this.onInputChange.bind(this));
        this.elements.input.addEventListener('keypress', this.onInputKeyPress.bind(this));
        this.elements.input.addEventListener('keyup', this.onInputKeyup.bind(this));
        this.elements.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
    }
    initProp() {
        this.#disabled = false;
        this._validationList = [];
        this.value = this.getAttribute('value') || '';
        this.validation = {
            isValid: null,
            message: null
        };
        //our config when user use type="number" and want more config
        this.numberFieldParameters = {
            //if input type is number we use this step to change value on +- clicks
            step: 1,
            //TODO: add min and max limit on type
            // maxValue:20,
            // minValue:10,
            //how many decimal  place we accept
            decimalPrecision: null,
            //if user type or paste something not a number, this char will be filled the replacement in most cases will be '0'
            invalidNumberReplacement: ''
        };
    }
    static get observedAttributes() {
        return ['label', 'type', 'message', 'value', 'name', 'autocomplete', 'placeholder', 'disabled', 'inputmode'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        this.onAttributeChange(name, newValue);
    }
    onAttributeChange(name, value) {
        switch (name) {
            case 'label':
                this._shadowRoot.querySelector('label .label-value').innerHTML = value;
                if (value == null || value == undefined || value == "") {
                    this._shadowRoot.querySelector('label').classList.add('--hide');
                } else {
                    this._shadowRoot.querySelector('label').classList.remove('--hide');
                }
                break;
            case 'type':
                this.elements.input.setAttribute('type', value);
                if (value == "password") {
                    this.initPassword();
                }
                if (value == "number") {
                    this.initNumberField();
                }

                break;
            case 'message':
                this._shadowRoot.querySelector('.message-box').innerHTML = value;
                break;
            case 'value':
                this.value = value;
                break;
            case 'name':
                this.elements.input.setAttribute('name', value);
                break;
            case 'autocomplete':
                this.elements.input.setAttribute('autocomplete', value);
                break;
            case 'placeholder':
                this.elements.input.placeholder = value;
                break;
            case 'disabled':
                if (value == '' || value === "true") {
                    this.#disabled = true;
                    this.elements.input.setAttribute('disabled', 'true');
                } else if (value == "false") {
                    this.#disabled = false;
                    this.elements.input.removeAttribute('disabled');
                }
                break;
            case 'inputmode':
                this.elements.input.setAttribute("inputmode",value);

        }

    }
    initPassword() {
        this.elements.inputBox.classList.add('type-password');
        this.isPasswordvisible = false;
        this._shadowRoot.querySelector('.password-trigger').addEventListener('click', this.onPasswordTriggerClicked.bind(this));
    }
    /**
     * @public
     * change number input config base on developer need
     * @param {*} numberConfig 
     */
    setNumberFieldParameter({ step, decimalPrecision, invalidNumberReplacement }) {
        if (step && !isNaN(step)) {
            this.numberFieldParameters.step = step;
        }
        if (decimalPrecision && !isNaN(decimalPrecision)) {
            this.numberFieldParameters.decimalPrecision = decimalPrecision;
        }
        if (invalidNumberReplacement) {
            this.numberFieldParameters.invalidNumberReplacement = invalidNumberReplacement;
        }
    }
    onPasswordTriggerClicked() {
        this.isPasswordvisible = !this.isPasswordvisible;
        const textField = this.elements.input;
        if (this.isPasswordvisible) {
            this._shadowRoot.querySelector('.password-trigger svg').classList.add('password-visible');
            textField.setAttribute('type', 'text');
        } else {
            this._shadowRoot.querySelector('.password-trigger svg').classList.remove('password-visible');
            textField.setAttribute('type', 'password');
        }
    }
    /**
     * 
     * @param {KeyboardEvent} e 
     */
    onInputKeyDown(e) {
        //handle up and down on number key
        if (this.getAttribute('type') == "number") {
            const key = e.key;
            if (key == "ArrowUp") {
                this.increaseNumber();
                e.preventDefault();
            }
            if (key == "ArrowDown") {
                this.decreaseNumber();
                e.preventDefault();
            }
            //debugger;
        }
        //trigger componnet event
        const keyDownnInitObj = {
            key: e.key,
            keyCode: e.keyCode,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            charCode: e.charCode,
            which: e.which
        };
        const event = new KeyboardEvent("keydown", keyDownnInitObj);
        this.dispatchEvent(event);
    }
    onInputKeyPress(e) {
        //TODO: raise keypress event
        const event = new CustomEvent('keypress');
        this.dispatchEvent(event);
    }
    onInputKeyup(e) {
        const inputText = e.target.value;
        this.value = inputText;
        this.triggerInputValidation(false);
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
        const event = new KeyboardEvent('keyup', keyUpInitObj);
        this.dispatchEvent(event);
        if (e.keyCode == 13) {
            this.onInputEnter();
        }
    }
    onInputEnter() {
        const event = new CustomEvent('enter');
        this.dispatchEvent(event);
    }
    onInputChange(e) {
        const inputText = e.target.value;
        this.triggerInputValidation(true);
        //here is the rare  time we update _value directly becuase we want trigger event that may read value directly from dom
        this.value = inputText;
        this.dispatchOnChangeEvent();
    }
    dispatchOnChangeEvent() {
        const validationObject = this.checkInputValidation(this.value);
        const event = new CustomEvent('change', {
            detail: {
                isValid: validationObject.isAllValid,
                validationObject: validationObject,
            },
        });
        this.dispatchEvent(event);
    }
    triggerInputValidation(showError = true) {
        // this method is for use out of component  for example if user click on submit button and developer want to check if all fields are valid
        //takeAction determine if we want to show user error in web component difualtManner or developer will handle it by himself
        const inputText = this.elements.input.value;

        const validationResult = this.checkInputValidation(inputText);
        this.validation = {
            isValid: validationResult.isAllValid,
            message: null
        };
        if (!validationResult.isAllValid) {
            const firstFault = validationResult.validationList.find(x => !x.isValid);
            this.validation.message = firstFault.message;
            if (showError == true) {
                this.showValidationError(firstFault.message);
            }
        } else {
            this.clearValidationError();
        }
        return validationResult;
    }
    checkInputValidation(value) {
        const validationResult = {
            validationList: [],
            isAllValid: true
        };
        this.validationList.forEach((validation) => {
            const res = this.checkValidation(value, validation);
            validationResult.validationList.push(res);
            if (!res.isValid) {
                validationResult.isAllValid = false;
            }
        });
        return validationResult;
    }
    checkValidation(text, validation) {
        var testRes;
        if (validation.validator instanceof RegExp) {
            testRes = validation.validator.test(text);
            validation.validator.lastIndex = 0;
        }

        if (typeof validation.validator == "function") {
            testRes = validation.validator(text);
        }

        if (!testRes) {
            return {
                isValid: false,
                message: validation.message,
                validation: validation
            };
        }
        return {
            isValid: true,
            message: '',
            validation: validation
        };
    }
    showValidationError(error) {
        this._shadowRoot.querySelector('.message-box').innerHTML = error;
        this._shadowRoot.querySelector('.message-box').classList.add('error');
    }
    clearValidationError() {
        const text = this.getAttribute('message') || '';
        this._shadowRoot.querySelector('.message-box').innerHTML = text;
        this._shadowRoot.querySelector('.message-box').classList.remove('error');
    }
    /**
     * @public
     */
    focus() {
        //public method
        this.elements.input.focus();
    }
    initNumberField() {
        const addFloatNumber = (num1, num2) => {
            const prec1 = `${num1}`.split('.')[1];
            const prec2 = `${num2}`.split('.')[1];
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
            if (isNaN(currentNumber)) { return; }
            const newNumber = addFloatNumber(currentNumber, this.numberFieldParameters.step);
            this.value = newNumber;
            this.dispatchOnChangeEvent();
        };
        this.decreaseNumber = () => {
            const currentNumber = parseFloat(this.value);
            if (isNaN(currentNumber)) { return; }
            const newNumber = addFloatNumber(currentNumber, (-1 * this.numberFieldParameters.step));
            this.value = newNumber;
            this.dispatchOnChangeEvent();
        };
        //if user set type="number" attribute
        this.elements.inputBox.classList.add('--type-number');
        const buttonsElement = document.createElement('div');
        buttonsElement.classList.add("number-control-wrapper");
        buttonsElement.innerHTML = NumberInputButtonsHTML;
        buttonsElement.querySelector('.increase-number-button').addEventListener('click', this.increaseNumber.bind(this));
        buttonsElement.querySelector('.decrease-number-button').addEventListener('click', this.decreaseNumber.bind(this));
        this.elements.inputBox.appendChild(buttonsElement);
    }
}
const myElementNotExists = !customElements.get('jb-input');
if (myElementNotExists) {
    window.customElements.define('jb-input', JBInputWebComponent);
}
