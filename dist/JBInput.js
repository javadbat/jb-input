var HTML = "<div class=\"jb-input-web-component\">\r\n    <label><span class=\"label-value\"></span><span>:</span></label>\r\n    <div class=\"input-box\">\r\n        <input class=\"input-box\">\r\n        <div class=\"password-trigger\">\r\n            <svg viewBox=\"0 0 120 120\">\r\n                <path class=\"eye-line\" stroke-linecap=\"round\"></path>\r\n                <circle cx=\"60\" cy=\"60\" r=\"20\"></circle>\r\n            </svg>\r\n        </div>\r\n    </div>\r\n    <div class=\"message-box\"></div>\r\n</div>";

var css_248z = ".jb-input-web-component {\n  width: 100%;\n  margin: 12px 0; }\n  .jb-input-web-component label {\n    width: 100%;\n    margin: 4px 0px;\n    display: block;\n    font-size: 0.8em;\n    color: #1f1735; }\n  .jb-input-web-component .input-box {\n    width: 100%;\n    box-sizing: border-box;\n    height: 40px;\n    border: solid 1px #f7f6f6;\n    background-color: #f7f6f6;\n    border-bottom: solid 3px #f7f6f6;\n    border-radius: 16px;\n    margin: 4px 0px;\n    display: block;\n    transition: ease 0.3s all;\n    overflow: hidden;\n    display: flex;\n    justify-content: space-between; }\n    .jb-input-web-component .input-box:focus-within {\n      border-color: #1e2832; }\n    .jb-input-web-component .input-box.type-password input {\n      width: calc(100% - 36px); }\n    .jb-input-web-component .input-box.type-password .password-trigger {\n      display: block;\n      height: 28px;\n      width: 28px;\n      margin: 4px 0 4px 8px;\n      cursor: pointer; }\n      .jb-input-web-component .input-box.type-password .password-trigger svg {\n        width: 100%;\n        height: 100%;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        transition: 0.2s; }\n        .jb-input-web-component .input-box.type-password .password-trigger svg.password-visible .eye-line {\n          stroke: #00b600;\n          d: path(\"M 10 60 C 30 20 100 20 110 60\"); }\n        .jb-input-web-component .input-box.type-password .password-trigger svg.password-visible circle {\n          opacity: 1;\n          transition: 0.2s 0.2s;\n          transform: translateX(8px); }\n        .jb-input-web-component .input-box.type-password .password-trigger svg .eye-line {\n          stroke-width: 14px;\n          stroke: #bbb;\n          fill: none;\n          stroke-linecap: round;\n          stroke-linejoin: round;\n          transition: 0.3s;\n          d: path(\"M 0 60 C 40 100 80 100 120 60\"); }\n        .jb-input-web-component .input-box.type-password .password-trigger svg circle {\n          fill: #00b600;\n          opacity: 0;\n          transition: 0.3s 0s; }\n    .jb-input-web-component .input-box .password-trigger {\n      display: none; }\n    .jb-input-web-component .input-box input {\n      border: none;\n      width: 100%;\n      box-sizing: border-box;\n      height: 100%;\n      background-color: transparent;\n      padding: 2px 12px 0 12px;\n      display: block;\n      font-family: inherit;\n      font-size: 1.1em;\n      color: #1f1735;\n      margin: 0;\n      border-radius: 0; }\n      .jb-input-web-component .input-box input:focus {\n        outline: none; }\n  .jb-input-web-component .message-box {\n    font-size: 0.7em;\n    padding: 2px 8px;\n    color: #929292; }\n    .jb-input-web-component .message-box:empty {\n      padding: 0; }\n    .jb-input-web-component .message-box.error {\n      color: red; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpCSW5wdXQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQVc7RUFDWCxjQUFjLEVBQUU7RUFDaEI7SUFDRSxXQUFXO0lBQ1gsZUFBZTtJQUNmLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsY0FBYyxFQUFFO0VBQ2xCO0lBQ0UsV0FBVztJQUNYLHNCQUFzQjtJQUN0QixZQUFZO0lBQ1oseUJBQXlCO0lBQ3pCLHlCQUF5QjtJQUN6QixnQ0FBZ0M7SUFDaEMsbUJBQW1CO0lBQ25CLGVBQWU7SUFDZixjQUFjO0lBQ2QseUJBQXlCO0lBQ3pCLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsOEJBQThCLEVBQUU7SUFDaEM7TUFDRSxxQkFBcUIsRUFBRTtJQUN6QjtNQUNFLHdCQUF3QixFQUFFO0lBQzVCO01BQ0UsY0FBYztNQUNkLFlBQVk7TUFDWixXQUFXO01BQ1gscUJBQXFCO01BQ3JCLGVBQWUsRUFBRTtNQUNqQjtRQUNFLFdBQVc7UUFDWCxZQUFZO1FBQ1oscUJBQXFCO1FBQ3JCLHNCQUFzQjtRQUN0QixnQkFBZ0IsRUFBRTtRQUNsQjtVQUNFLGVBQWU7VUFDZix3Q0FBd0MsRUFBRTtRQUM1QztVQUNFLFVBQVU7VUFDVixxQkFBcUI7VUFDckIsMEJBQTBCLEVBQUU7UUFDOUI7VUFDRSxrQkFBa0I7VUFDbEIsWUFBWTtVQUNaLFVBQVU7VUFDVixxQkFBcUI7VUFDckIsc0JBQXNCO1VBQ3RCLGdCQUFnQjtVQUNoQix3Q0FBd0MsRUFBRTtRQUM1QztVQUNFLGFBQWE7VUFDYixVQUFVO1VBQ1YsbUJBQW1CLEVBQUU7SUFDM0I7TUFDRSxhQUFhLEVBQUU7SUFDakI7TUFDRSxZQUFZO01BQ1osV0FBVztNQUNYLHNCQUFzQjtNQUN0QixZQUFZO01BQ1osNkJBQTZCO01BQzdCLHdCQUF3QjtNQUN4QixjQUFjO01BQ2Qsb0JBQW9CO01BQ3BCLGdCQUFnQjtNQUNoQixjQUFjO01BQ2QsU0FBUztNQUNULGdCQUFnQixFQUFFO01BQ2xCO1FBQ0UsYUFBYSxFQUFFO0VBQ3JCO0lBQ0UsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixjQUFjLEVBQUU7SUFDaEI7TUFDRSxVQUFVLEVBQUU7SUFDZDtNQUNFLFVBQVUsRUFBRSIsImZpbGUiOiJKQklucHV0LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuamItaW5wdXQtd2ViLWNvbXBvbmVudCB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW46IDEycHggMDsgfVxuICAuamItaW5wdXQtd2ViLWNvbXBvbmVudCBsYWJlbCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWFyZ2luOiA0cHggMHB4O1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGZvbnQtc2l6ZTogMC44ZW07XG4gICAgY29sb3I6ICMxZjE3MzU7IH1cbiAgLmpiLWlucHV0LXdlYi1jb21wb25lbnQgLmlucHV0LWJveCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBoZWlnaHQ6IDQwcHg7XG4gICAgYm9yZGVyOiBzb2xpZCAxcHggI2Y3ZjZmNjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmNmY2O1xuICAgIGJvcmRlci1ib3R0b206IHNvbGlkIDNweCAjZjdmNmY2O1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgbWFyZ2luOiA0cHggMHB4O1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHRyYW5zaXRpb246IGVhc2UgMC4zcyBhbGw7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgfVxuICAgIC5qYi1pbnB1dC13ZWItY29tcG9uZW50IC5pbnB1dC1ib3g6Zm9jdXMtd2l0aGluIHtcbiAgICAgIGJvcmRlci1jb2xvcjogIzFlMjgzMjsgfVxuICAgIC5qYi1pbnB1dC13ZWItY29tcG9uZW50IC5pbnB1dC1ib3gudHlwZS1wYXNzd29yZCBpbnB1dCB7XG4gICAgICB3aWR0aDogY2FsYygxMDAlIC0gMzZweCk7IH1cbiAgICAuamItaW5wdXQtd2ViLWNvbXBvbmVudCAuaW5wdXQtYm94LnR5cGUtcGFzc3dvcmQgLnBhc3N3b3JkLXRyaWdnZXIge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBoZWlnaHQ6IDI4cHg7XG4gICAgICB3aWR0aDogMjhweDtcbiAgICAgIG1hcmdpbjogNHB4IDAgNHB4IDhweDtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjsgfVxuICAgICAgLmpiLWlucHV0LXdlYi1jb21wb25lbnQgLmlucHV0LWJveC50eXBlLXBhc3N3b3JkIC5wYXNzd29yZC10cmlnZ2VyIHN2ZyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIHN0cm9rZS1saW5lY2FwOiByb3VuZDtcbiAgICAgICAgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDtcbiAgICAgICAgdHJhbnNpdGlvbjogMC4yczsgfVxuICAgICAgICAuamItaW5wdXQtd2ViLWNvbXBvbmVudCAuaW5wdXQtYm94LnR5cGUtcGFzc3dvcmQgLnBhc3N3b3JkLXRyaWdnZXIgc3ZnLnBhc3N3b3JkLXZpc2libGUgLmV5ZS1saW5lIHtcbiAgICAgICAgICBzdHJva2U6ICMwMGI2MDA7XG4gICAgICAgICAgZDogcGF0aChcIk0gMTAgNjAgQyAzMCAyMCAxMDAgMjAgMTEwIDYwXCIpOyB9XG4gICAgICAgIC5qYi1pbnB1dC13ZWItY29tcG9uZW50IC5pbnB1dC1ib3gudHlwZS1wYXNzd29yZCAucGFzc3dvcmQtdHJpZ2dlciBzdmcucGFzc3dvcmQtdmlzaWJsZSBjaXJjbGUge1xuICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgdHJhbnNpdGlvbjogMC4ycyAwLjJzO1xuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCg4cHgpOyB9XG4gICAgICAgIC5qYi1pbnB1dC13ZWItY29tcG9uZW50IC5pbnB1dC1ib3gudHlwZS1wYXNzd29yZCAucGFzc3dvcmQtdHJpZ2dlciBzdmcgLmV5ZS1saW5lIHtcbiAgICAgICAgICBzdHJva2Utd2lkdGg6IDE0cHg7XG4gICAgICAgICAgc3Ryb2tlOiAjYmJiO1xuICAgICAgICAgIGZpbGw6IG5vbmU7XG4gICAgICAgICAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO1xuICAgICAgICAgIHN0cm9rZS1saW5lam9pbjogcm91bmQ7XG4gICAgICAgICAgdHJhbnNpdGlvbjogMC4zcztcbiAgICAgICAgICBkOiBwYXRoKFwiTSAwIDYwIEMgNDAgMTAwIDgwIDEwMCAxMjAgNjBcIik7IH1cbiAgICAgICAgLmpiLWlucHV0LXdlYi1jb21wb25lbnQgLmlucHV0LWJveC50eXBlLXBhc3N3b3JkIC5wYXNzd29yZC10cmlnZ2VyIHN2ZyBjaXJjbGUge1xuICAgICAgICAgIGZpbGw6ICMwMGI2MDA7XG4gICAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgICB0cmFuc2l0aW9uOiAwLjNzIDBzOyB9XG4gICAgLmpiLWlucHV0LXdlYi1jb21wb25lbnQgLmlucHV0LWJveCAucGFzc3dvcmQtdHJpZ2dlciB7XG4gICAgICBkaXNwbGF5OiBub25lOyB9XG4gICAgLmpiLWlucHV0LXdlYi1jb21wb25lbnQgLmlucHV0LWJveCBpbnB1dCB7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIHBhZGRpbmc6IDJweCAxMnB4IDAgMTJweDtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgICBmb250LXNpemU6IDEuMWVtO1xuICAgICAgY29sb3I6ICMxZjE3MzU7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBib3JkZXItcmFkaXVzOiAwOyB9XG4gICAgICAuamItaW5wdXQtd2ViLWNvbXBvbmVudCAuaW5wdXQtYm94IGlucHV0OmZvY3VzIHtcbiAgICAgICAgb3V0bGluZTogbm9uZTsgfVxuICAuamItaW5wdXQtd2ViLWNvbXBvbmVudCAubWVzc2FnZS1ib3gge1xuICAgIGZvbnQtc2l6ZTogMC43ZW07XG4gICAgcGFkZGluZzogMnB4IDhweDtcbiAgICBjb2xvcjogIzkyOTI5MjsgfVxuICAgIC5qYi1pbnB1dC13ZWItY29tcG9uZW50IC5tZXNzYWdlLWJveDplbXB0eSB7XG4gICAgICBwYWRkaW5nOiAwOyB9XG4gICAgLmpiLWlucHV0LXdlYi1jb21wb25lbnQgLm1lc3NhZ2UtYm94LmVycm9yIHtcbiAgICAgIGNvbG9yOiByZWQ7IH1cbiJdfQ== */";

class JBInputWebComponent extends HTMLElement {
    static get formAssociated() { return true; }
    get value() {
        return this._value
    }
    set value(value) {
        this._value = value;
        this.internals_.setFormValue(value);
        this._shadowRoot.querySelector('.input-box input').setAttribute('value', value);
    }
    constructor() {
        super();
        this.internals_ = this.attachInternals();
        this.initWebComponent();
        this.initProp();
        // js standard input element to more assosicate it with form element
    }
    initWebComponent() {
        this._shadowRoot = this.attachShadow({
            mode: 'open'
        });
        this._html = `<style>${css_248z}</style>` + '\n' + HTML;
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
    }
    initProp() {
        this.validationList = [];
        this.value = this.getAttribute('value') || '';
        this.validation = {
            isValid: null,
            message: null
        };
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
        this._shadowRoot.querySelector('.password-trigger').addEventListener('click', this.onPasswordTriggerClicked.bind(this));
    }
    onPasswordTriggerClicked() {
        this.isPasswordvisible = !this.isPasswordvisible;
        const textField = this._shadowRoot.querySelector('.input-box input');
        if (this.isPasswordvisible) {
            this._shadowRoot.querySelector('.password-trigger svg').classList.add('password-visible');
            textField.setAttribute('type', 'text');
        } else {
            this._shadowRoot.querySelector('.password-trigger svg').classList.remove('password-visible');
            textField.setAttribute('type', 'password');
        }
    }
    onInputKeyPress() {
        //TODO: raise keypress event
    }
    onInputKeyup(e) {
        const inputText = e.target.value;
        this.triggerInputValidation(false);
        //here is the rare  time we update _value directly becuase we want trigger event that may read value directly from dom
        this._value = inputText;
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
        };
        this._shadowRoot.querySelector('.message-box').innerHTML = error;
        this._shadowRoot.querySelector('.message-box').classList.add('error');
    }
    clearValidationError() {
        this.validation = {
            isValid: true,
            message: null
        };
        const text = this.getAttribute('message') || '';
        this._shadowRoot.querySelector('.message-box').innerHTML = text;
        this._shadowRoot.querySelector('.message-box').classList.remove('error');
    }
}
const myElementNotExists = !customElements.get('jb-input');
if(myElementNotExists){
    window.customElements.define('jb-input', JBInputWebComponent);
}
//# sourceMappingURL=JBInput.js.map
