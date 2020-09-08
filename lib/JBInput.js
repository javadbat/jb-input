import HTML from './JBInput.html';
import CSS from './JBInput.scss';
class JBInputWebComponent extends HTMLElement {
    static get formAssociated() { return true; }
    get value() {
        return this._value
    }
    set value(value) {
        this._value = value;
        if(this.internals_){
            this.internals_.setFormValue(value);
        }
        this._shadowRoot.querySelector('.input-box input').setAttribute('value', value);
    }
    constructor() {
        super();
        if(typeof this.attachInternals == "function"){
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
            mode: 'open'
        });
        this._html = `<style>${CSS}</style>` + '\n' + HTML
        this._element = document.createElement('template');
        this._element.innerHTML = this._html;
        this._shadowRoot.appendChild(this._element.content.cloneNode(true));
        this.inputElement = this._shadowRoot.querySelector('.input-box input');
        this.registerEventListener();
    }
    registerEventListener() {
        this.inputElement.addEventListener('change', this.onInputChange.bind(this));
        this.inputElement.addEventListener('keypress', this.onInputKeyPress.bind(this));
        this.inputElement.addEventListener('keyup', this.onInputKeyup.bind(this));
        this.inputElement.addEventListener('keydown',this.onInputKeyDown.bind(this))
    }
    initProp() {
        this.validationList = [];
        this.value = this.getAttribute('value') || '';
        this.validation = {
            isValid: null,
            message: null
        }
    }
    static get observedAttributes() {
        return ['label', 'type', 'message', 'value', 'name', 'autocomplete'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        this.onAttributeChange(name, newValue);
    }
    onAttributeChange(name, value) {
        switch (name) {
            case 'label':
                this._shadowRoot.querySelector('label .label-value').innerHTML = value;
                if(value == null || value == undefined || value == ""){
                    this._shadowRoot.querySelector('label').classList.add('--hide');
                }else{
                    this._shadowRoot.querySelector('label').classList.remove('--hide');
                }
                break;
            case 'type':
                this.inputElement.setAttribute('type', value);
                if (value == "password") {
                    this.initPassword();
                }
                break;
            case 'message':
                this._shadowRoot.querySelector('.message-box').innerHTML = value;
                break;
            case 'value':
                this.value = value;
                break;
            case 'name':
                this.inputElement.setAttribute('name',value);
                break;
            case 'autocomplete':
                this.inputElement.setAttribute('autocomplete', value);
                break;
        }

    }
    initPassword() {
        this._shadowRoot.querySelector('.input-box').classList.add('type-password');
        this.isPasswordvisible = false;
        this._shadowRoot.querySelector('.password-trigger').addEventListener('click', this.onPasswordTriggerClicked.bind(this))
    }
    onPasswordTriggerClicked() {
        this.isPasswordvisible = !this.isPasswordvisible;
        const textField = this._shadowRoot.querySelector('.input-box input');
        if (this.isPasswordvisible) {
            this._shadowRoot.querySelector('.password-trigger svg').classList.add('password-visible');
            textField.setAttribute('type', 'text')
        } else {
            this._shadowRoot.querySelector('.password-trigger svg').classList.remove('password-visible');
            textField.setAttribute('type', 'password')
        }
    }
    onInputKeyDown(e){
        const keyDownnInitObj = {
            key:e.key,
            keyCode:e.keyCode,
            code:e.code,
            ctrlKey:e.ctrlKey,
            shiftKey:e.shiftKey,
            altKey:e.altKey,
            charCode:e.charCode,
            which:e.which
        }
        const event = new KeyboardEvent("keydown",keyDownnInitObj);
        this.dispatchEvent(event);
    }
    onInputKeyPress() {
        //TODO: raise keypress event
        const event = new CustomEvent('keypress');
        this.dispatchEvent(event);
    }
    onInputKeyup(e) {
        const inputText = e.target.value;
        this.triggerInputValidation(false);
        //here is the rare  time we update _value directly becuase we want trigger event that may read value directly from dom
        this._value = inputText;
        const event = new CustomEvent('keyup');
        this.dispatchEvent(event);
    }
    onInputChange(e) {
        const inputText = e.target.value;
        this.triggerInputValidation(true);
        //here is the rare  time we update _value directly becuase we want trigger event that may read value directly from dom
        this._value = inputText;
        const validationObject = this.checkInputValidation(inputText);
        const event = new CustomEvent('change',{
            detail: {
                isValid: validationObject.isAllValid,
                validationObject:validationObject,
            },
        });
        this.dispatchEvent(event);
    }
    triggerInputValidation(showError = true) {
        // this method is for use out of component  for example if user click on submit button and developer want to check if all fields are valid
        //takeAction determine if we want to show user error in web component difualtManner or developer will handle it by himself
        const inputText = this._shadowRoot.querySelector('.input-box input').value;
        
        const validationResult = this.checkInputValidation(inputText);
        
        if (showError == true && !validationResult.isAllValid) {
            const firstFault = validationResult.validationList.find(x => !x.isValid);
            this.showValidationError(firstFault.message);
        } else if(validationResult.isAllValid) {
            this.clearValidationError();
        }
        return validationResult;
    }
    checkInputValidation(value){
        const validationResult = {
            validationList: [],
            isAllValid: true
        }
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
        var testRes
        if(validation.validator instanceof RegExp){
            testRes = validation.validator.test(text);
            validation.validator.lastIndex = 0;
        }

        if(typeof validation.validator == "function"){
            testRes = validation.validator(text);
        }

        if (!testRes) {
            return {
                isValid: false,
                message: validation.message,
                validation: validation
            }
        }
        return {
            isValid: true,
            message: '',
            validation: validation
        };
    }
    showValidationError(error) {
        this.validation = {
            isValid: false,
            message: error
        }
        this._shadowRoot.querySelector('.message-box').innerHTML = error;
        this._shadowRoot.querySelector('.message-box').classList.add('error')
    }
    clearValidationError() {
        this.validation = {
            isValid: true,
            message: null
        }
        const text = this.getAttribute('message') || '';
        this._shadowRoot.querySelector('.message-box').innerHTML = text;
        this._shadowRoot.querySelector('.message-box').classList.remove('error')
    }
    /**
     * @public
     */
    focus(){
        //public method
        this.inputElement.focus();
    }
}
const myElementNotExists = !customElements.get('jb-input');
if(myElementNotExists){
    window.customElements.define('jb-input', JBInputWebComponent);
}
