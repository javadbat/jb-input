import HTML from './JBInput.html';
import CSS from './JBInput.scss';
import NumberInputButtonsHTML from './NumberInputButtons.html';
import './inbox-element/inbox-element';
import { ElementsObject, JBInputStandardValueObject, JBInputValidationItem, NumberFieldParameter, NumberFieldParameterInput, ValidationResult, ValidationResultItem, ValidationResultSummary } from './Types';
export class JBInputWebComponent extends HTMLElement {
    static get formAssociated() { return true; }
    #value = '';
    elements!: ElementsObject;
    #validationList: JBInputValidationItem[] = [];
    #disabled = false;
    internals_?: ElementInternals;
    numberFieldParameters: NumberFieldParameter = {
        //if input type is number we use this step to change value on +- clicks
        step: 1,
        maxValue:null,
        minValue:null,
        //how many decimal  place we accept
        decimalPrecision: null,
        //if user type or paste something not a number, this char will be filled the replacement in most cases will be '0'
        invalidNumberReplacement: '',
        //for money and big number seperate with a comma
        useThousandSeparator: false,
        thousandSeparator:',',
        acceptNegative: true,
        
    };
    validation?: ValidationResultSummary;
    isPasswordvisible: boolean | undefined;
    increaseNumber?: () => void;
    decreaseNumber?: () => void;
    get value(): string {
        return this.#value;
    }
    set value(value: string) {
        const standardedValue = this.standardValue(value);
        this.#value = standardedValue.value;
        //comment for typescript problem
        if (this.internals_ && typeof this.internals_.setFormValue == "function") {
            this.internals_.setFormValue(standardedValue.value);
        }
        this.elements.input.value = standardedValue.displayValue;
    }
    get validationList(): JBInputValidationItem[] {
        return this.#validationList;
    }
    set validationList(value: JBInputValidationItem[]) {
        this.#validationList = value;
        this.checkValidity(false);
    }
    constructor() {
        super();
        if (typeof this.attachInternals == "function") {
            //some browser dont support attachInternals
            this.internals_ = this.attachInternals();
        }
        this.initWebComponent();
    }
    connectedCallback(): void {
        // standard web component event that called when all of dom is binded
        this.callOnLoadEvent();
        this.initProp();
        this.callOnInitEvent();

    }
    callOnLoadEvent(): void {
        const event = new CustomEvent('load', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    callOnInitEvent(): void {
        const event = new CustomEvent('init', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    initWebComponent(): void {
        const shadowRoot = this.attachShadow({
            mode: 'open',
            delegatesFocus: true,
        });
        const html = `<style>${CSS}</style>` + '\n' + HTML;
        const element = document.createElement('template');
        element.innerHTML = html;
        shadowRoot.appendChild(element.content.cloneNode(true));
        this.elements = {
            input: shadowRoot.querySelector('.input-box input')!,
            inputBox: shadowRoot.querySelector('.input-box')!,
            label: shadowRoot.querySelector('label')!,
            labelValue: shadowRoot.querySelector('label .label-value')!,
            messageBox: shadowRoot.querySelector('.message-box')!,
            passwordTrigger: shadowRoot.querySelector('.password-trigger')!,
        };
        this.registerEventListener();
    }

    /**
     * this function will get user inputed or pasted text and convert it to standard one base on developer config
     * @param {String | number} valueString 
     * @return {String} standard value
     */
    standardValue(valueString: string | number): JBInputStandardValueObject {
        if(typeof valueString !== "string"){
            if(typeof valueString === "number"){
                if(!isNaN(valueString)){
                    valueString = `${valueString}`;
                }else{
                    valueString = this.numberFieldParameters?this.numberFieldParameters.invalidNumberReplacement:'';
                }
            }else{
                valueString = this.numberFieldParameters?this.numberFieldParameters.invalidNumberReplacement:'';
            }
        }
        let standardedValue:JBInputStandardValueObject = {
            displayValue:valueString,
            value:valueString
        };
        if (this.getAttribute('type') == "number") {
            standardedValue = this.standardValueForNumberInput(valueString);
        }
        return standardedValue;
    }
    /**
     * 
     * @param {String} inputValueString 
     * @return {String} standard value
     */
    standardValueForNumberInput(inputValueString: string): JBInputStandardValueObject {
        if(inputValueString == '-' && this.numberFieldParameters!.acceptNegative == true){
            //if user type - and we accept negative number we let user to continue typing
            return {
                displayValue:inputValueString,
                value:inputValueString
            };
        }
        let valueString = inputValueString;
        //if  comma separator is used we need to remove it
        if(this.numberFieldParameters && this.numberFieldParameters.useThousandSeparator){
            valueString = valueString.replace(new RegExp(`${this.numberFieldParameters.thousandSeparator}`,'g'), '');
        }
        //if our input type is number and user want to set it to new value we do nececcery logic here
        let value: number = parseFloat(valueString);
        if (isNaN(value)) {
            //we change nothing
            valueString = this.numberFieldParameters!.invalidNumberReplacement;
        }
        //add max and min checker to prevent bigger value assignment
        if(this.numberFieldParameters.maxValue && value> this.numberFieldParameters.maxValue){
            value = this.numberFieldParameters.maxValue;
            valueString = `${this.numberFieldParameters.maxValue}`;
        }
        if(this.numberFieldParameters.minValue && value< this.numberFieldParameters.minValue){
            value = this.numberFieldParameters.minValue;
            valueString = `${this.numberFieldParameters.minValue}`;
        }
        const[integerNums, decimalNums] = valueString.split('.');
        
        const decimalPrecisionCount = decimalNums ? decimalNums.length : 0;
        if (this.numberFieldParameters && !(this.numberFieldParameters.decimalPrecision === null || this.numberFieldParameters.decimalPrecision == undefined) && decimalPrecisionCount && decimalPrecisionCount > this.numberFieldParameters.decimalPrecision) {
            // truncate extra decimal
            const checkRegex = new RegExp(`^-?\\d+(?:\\.\\d{0,${this.numberFieldParameters!.decimalPrecision}})?`);
            const match = valueString.match(checkRegex);
            if (match && match[0]) {
                valueString = match[0];
            }
        }
        //remove start zero when number is more than one digit 065 => 65
        if(integerNums.startsWith('0') && integerNums.length > 1){
            valueString = valueString.substring(1);
        }
        if( integerNums.startsWith('-') && integerNums.charAt(1) == '0' && integerNums.length > 2){
            valueString = '-'+valueString.substring(2);
        }
        // check for negative value
        if(this.numberFieldParameters && this.numberFieldParameters.acceptNegative == false && integerNums.startsWith('-')){
            valueString = this.numberFieldParameters!.invalidNumberReplacement;
            console.error('negative number is not allowed change numberFieldParameters.acceptNegative to true to allow negative numbers');
        }
        const standardValueObject: JBInputStandardValueObject = {
            displayValue: valueString,
            value: valueString,
        };
        // add thousand separator comma
        if(this.numberFieldParameters && this.numberFieldParameters.useThousandSeparator){
            standardValueObject.displayValue = valueString.replace(/\B(?=(\d{3})+(?!\d))/g, this.numberFieldParameters.thousandSeparator);
        }
        return standardValueObject;
    }
    registerEventListener(): void {
        this.elements.input.addEventListener('change', (e) => this.onInputChange((e)));
        this.elements.input.addEventListener('beforeinput', this.onInputBeforeInput.bind(this));
        this.elements.input.addEventListener('input', (e) => this.onInputInput((e as unknown as InputEvent)));
        this.elements.input.addEventListener('keypress', this.onInputKeyPress.bind(this));
        this.elements.input.addEventListener('keyup', this.onInputKeyup.bind(this));
        this.elements.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
    }
    initProp() {
        this.#disabled = false;
        this.#validationList = [];
        this.value = this.getAttribute('value') || '';
        this.validation = {
            isValid: null,
            message: null
        };
    }
    static get observedAttributes(): string[] {
        return ['label', 'type', 'message', 'value', 'name', 'autocomplete', 'placeholder', 'disabled', 'inputmode'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        // do something when an attribute has changed
        this.onAttributeChange(name, newValue);
    }
    onAttributeChange(name: string, value: string): void {
        switch (name) {
            case 'label':
                this.elements.labelValue.innerHTML = value;
                if (value == null || value == undefined || value == "") {
                    this.elements.label.classList.add('--hide');
                } else {
                    this.elements.label.classList.remove('--hide');
                }
                break;
            case 'type':
                if(value !=='number'){
                    //we handle number manually
                    this.elements.input.setAttribute('type', value);
                }
                if (value == "password") {
                    this.initPassword();
                }
                if (value == "number") {
                    if(this.getAttribute('inputmode') == null){
                        this.setAttribute('inputmode', 'numeric');
                    }
                    this.initNumberField();
                }

                break;
            case 'message':
                this.elements.messageBox.innerHTML = value;
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
                this.elements.input.setAttribute("inputmode", value);

        }

    }
    initPassword(): void {
        this.elements.inputBox.classList.add('type-password');
        this.isPasswordvisible = false;
        this.elements.passwordTrigger.addEventListener('click', this.onPasswordTriggerClicked.bind(this));
    }
    /**
     * @public
     * change number input config base on developer need
     * @param {NumberFieldParameterInput} numberFieldParameters 
     */
    setNumberFieldParameter(numberFieldParameters: NumberFieldParameterInput): void {
        if (numberFieldParameters.step && !isNaN(numberFieldParameters.step)) {
            this.numberFieldParameters!.step = numberFieldParameters.step;
        }
        if (numberFieldParameters && numberFieldParameters.decimalPrecision !== null && numberFieldParameters.decimalPrecision !== undefined && !isNaN(numberFieldParameters.decimalPrecision)) {
            this.numberFieldParameters!.decimalPrecision = numberFieldParameters.decimalPrecision;
        }
        if (numberFieldParameters && numberFieldParameters.invalidNumberReplacement) {
            this.numberFieldParameters!.invalidNumberReplacement = numberFieldParameters.invalidNumberReplacement;
        }
        if(numberFieldParameters && typeof numberFieldParameters.useThousandSeparator == 'boolean'){
            this.numberFieldParameters!.useThousandSeparator = numberFieldParameters.useThousandSeparator;
        }
        if(numberFieldParameters && typeof numberFieldParameters.thousandSeparator == 'string'){
            this.numberFieldParameters!.thousandSeparator = numberFieldParameters.thousandSeparator;
        }
        if(numberFieldParameters && typeof numberFieldParameters.acceptNegative == 'boolean'){
            this.numberFieldParameters!.acceptNegative = numberFieldParameters.acceptNegative;
        }
        if(numberFieldParameters && typeof numberFieldParameters.maxValue == 'number'){
            this.numberFieldParameters.maxValue = numberFieldParameters.maxValue;
        }
        if(numberFieldParameters && typeof numberFieldParameters.minValue == 'number'){
            this.numberFieldParameters.minValue = numberFieldParameters.minValue;
        }
        this.value = `${this.value}`;
    }
    onPasswordTriggerClicked(): void {
        this.isPasswordvisible = !this.isPasswordvisible;
        const textField = this.elements.input;
        const passwordTriggerSVG = this.elements.passwordTrigger.querySelector('svg')!;
        if (this.isPasswordvisible) {
            passwordTriggerSVG.classList.add('password-visible');
            textField.setAttribute('type', 'text');
        } else {
            passwordTriggerSVG.classList.remove('password-visible');
            textField.setAttribute('type', 'password');
        }
    }
    /**
     * 
     * @param {KeyboardEvent} e 
     */
    onInputKeyDown(e: KeyboardEvent): void {
        //handle up and down on number key
        if (this.getAttribute('type') == "number") {
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
        const event = new KeyboardEvent('keypress', keyPressInitObj);
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
        const event = new KeyboardEvent('keyup', keyUpInitObj);
        this.dispatchEvent(event);
        if (e.keyCode == 13) {
            this.onInputEnter();
        }
    }
    onInputEnter(): void {
        const event = new CustomEvent('enter');
        this.dispatchEvent(event);
    }
    /**
     * 
     * @param {InputEvent} e 
     */
    onInputInput(e: InputEvent): void {
        const inputText = (e.target as HTMLInputElement).value;
        this.value = inputText;
        this.checkValidity(false);
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
        const event = new InputEvent('input', eventInitDict);
        this.dispatchEvent(event);
    }
    /**
     * check if string value is a number
     * @param {string} value 
     * @return {boolean}
     */
    private isStringisNumber(value: string | null): boolean {
        if( value == null || value == undefined ||value.trim().length == 0){
            return false;
        }else{
            return !isNaN(Number(value));
        }
    }
    /**
    * 
    * @param {InputEvent} e 
    */
    onInputBeforeInput(e: InputEvent): void {
        const endCarretPos = (e.target as HTMLInputElement).selectionEnd || 0;
        const startCarretPos = (e.target as HTMLInputElement).selectionStart || 0;
        let isPreventDefault = false;
        // we check number input type field and prevent non number values
        if(this.getAttribute('type') == 'number' && e.inputType !== 'deleteContentBackward' && !this.isStringisNumber(e.data)){
            isPreventDefault = true;
            // we made exception for . char if its valid by user
            if(e.data == '.' && this.numberFieldParameters!.decimalPrecision !== 0 && this.value.indexOf('.') == -1 && !(endCarretPos == 0 || startCarretPos == 0) && !(this.numberFieldParameters!.decimalPrecision !== null && this.value.substring(endCarretPos).length > this.numberFieldParameters!.decimalPrecision)){
                isPreventDefault = false;
            }
            //for '-' char we check if negetive number is allowed
            if(this.numberFieldParameters && this.numberFieldParameters.acceptNegative && e.data == '-' && (startCarretPos == 0 || endCarretPos == 0)){
                isPreventDefault = false;
            }
        }
        if(isPreventDefault){
            e.preventDefault();
        }
        this.dispatchBeforeInputEvent(e);
    }
    private dispatchBeforeInputEvent(e: InputEvent): boolean {
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
        const event = new InputEvent('beforeinput', eventInitDict);
        this.dispatchEvent(event);
        if (event.defaultPrevented) {
            e.preventDefault();
        }
        return event.defaultPrevented;
    }
    onInputChange(e: Event): void {
        const inputText = (e.target as HTMLInputElement).value;
        this.checkValidity(true);
        //here is the rare  time we update _value directly becuase we want trigger event that may read value directly from dom
        this.value = inputText;
        this.dispatchOnChangeEvent();
    }
    dispatchOnChangeEvent():void{
        const validationObject = this.checkInputValidation(this.value);
        const event = new CustomEvent('change', {
            detail: {
                isValid: validationObject.isAllValid,
                validationObject: validationObject,
            },
        });
        this.dispatchEvent(event);
    }
    /**
     * check if input validation list is fullfilled or not
     * @param {boolean} showError indicate whether show error or not
     * @return {ValidationResult} 
     */
    checkValidity(showError = true):ValidationResult{
    
        // this method is for use out of component  for example if user click on submit button and developer want to check if all fields are valid
        //takeAction determine if we want to show user error in web component difualtManner or developer will handle it by himself
        const inputText = this.elements.input.value;

        const validationResult = this.checkInputValidation(inputText);
        this.validation = {
            isValid: validationResult.isAllValid,
            message: null
        };
        if (!validationResult.isAllValid) {
            const firstFault = validationResult.validationList.find(x => !x.isValid)!;
            this.validation.message = firstFault.message;
            if (showError == true) {
                this.showValidationError(firstFault.message!);
            }
        } else {
            this.clearValidationError();
        }
        return validationResult;
    }
    /**
     * @deprecated use checkValidity instead it will be removed in future version
     * @param {boolean} showError indicate whether show error or not
     * @return {ValidationResult} 
     */
    triggerInputValidation(showError = true):ValidationResult{
        return this.checkValidity(showError);
    }
    checkInputValidation(value: string) {
        const validationResult: ValidationResult = {
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
    checkValidation(text: string, validation: JBInputValidationItem): ValidationResultItem {
        let testRes;
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
    showValidationError(error: string) {
        this.elements.messageBox.innerHTML = error;
        this.elements.messageBox.classList.add('error');
    }
    clearValidationError() {
        const text = this.getAttribute('message') || '';
        this.elements.messageBox.innerHTML = text;
        this.elements.messageBox.classList.remove('error');
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
            const step = this.numberFieldParameters?this.numberFieldParameters.step:1;
            const newNumber = addFloatNumber(currentNumber, step);
            this.value = `${newNumber}`;
            this.dispatchOnChangeEvent();
        };
        this.decreaseNumber = () => {
            const currentNumber = parseFloat(this.value);
            if (isNaN(currentNumber)) { return; }
            const step = this.numberFieldParameters?this.numberFieldParameters.step:1;
            let newNumber = addFloatNumber(currentNumber, (-1 * step));
            if(newNumber < 0 && !(this.numberFieldParameters && this.numberFieldParameters.acceptNegative)){
                newNumber = 0;
            }
            this.value = `${newNumber}`;
            this.dispatchOnChangeEvent();
        };
        //if user set type="number" attribute
        this.elements.inputBox.classList.add('--type-number');
        const buttonsElement = document.createElement('div');
        buttonsElement.classList.add("number-control-wrapper");
        buttonsElement.innerHTML = NumberInputButtonsHTML;
        buttonsElement.querySelector('.increase-number-button')!.addEventListener('click', this.increaseNumber.bind(this));
        buttonsElement.querySelector('.decrease-number-button')!.addEventListener('click', this.decreaseNumber.bind(this));
        this.elements.inputBox.appendChild(buttonsElement);
        this.value = `${this.value}`;
    }
}
const myElementNotExists = !customElements.get('jb-input');
if (myElementNotExists) {
    window.customElements.define('jb-input', JBInputWebComponent);
}
