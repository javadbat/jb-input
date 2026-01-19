# jb-input

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-input)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-input/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dw/jb-input)](https://www.npmjs.com/package/jb-input)

text input web component with these benefit:

- easy to add custom regex or function validation.

- multiple validation with different message.

- support both RTL and LTR.

- add label and message in UX friendly format.

- customizable ui with css variable sp you can have multiple style in different scope of your app.

- extendable so you can create your own custom input base on jb-input like [jb-number-input](https://github.com/javadbat/jb-number-input).

- can accept persian number char and convert them to english char in value.

## Demo

- [codepen](https://codepen.io/javadbat/pen/dyNwddd)
- [storybook](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput)

## using with JS frameworks

to use this component in **react** see [`jb-input/react`](https://github.com/javadbat/jb-input/tree/main/react);


## install

### using npm

```sh
npm i jb-input
```

We must import package in one of our js files.

```js
import 'jb-input';

```
> if you are using typescript or you need to import other modules of the component please use one nameless import and one named import(to bypass treeshake).

in your html or jsx

```html
<jb-input label="your label" message="hint text under the text box"></jb-input>
```
### using cdn

you can just add script tag to your html file and then use web component how ever you need

```HTML
<script src="https://unpkg.com/jb-input/dist/JBInput.umd.js"></script>
```

## get/set value
like normal native input you can get/set value like below or use html attribute.

```js
//get value
const inputValue = document.getElementByTagName('jb-input').value;
//set value
document.getElementByTagName('jb-input').value = "new string";
```

```HTML
<jb-input value="your value" />
```

## events

```js
document.getElementByTagName('jb-input').addEventListener('change',(event)=>{console.log(event.target.value)});
document.getElementByTagName('jb-input').addEventListener('keyup',(event)=>{console.log(event.target.value)});
document.getElementByTagName('jb-input').addEventListener('keydown',(event)=>{console.log(event.target.value)});
document.getElementByTagName('jb-input').addEventListener('keypress',(event)=>{console.log(event.target.value)});
document.getElementByTagName('jb-input').addEventListener('input',(event)=>{console.log(event.target.value)});
document.getElementByTagName('jb-input').addEventListener('beforeinput',(event)=>{console.log(event.target.value)});
// when user press enter on keyboard(dispatched on onKeyup)
document.getElementByTagName('jb-input').addEventListener('enter',(event)=>{console.log(event.target.value)});
```

## set validation

jb-input use [jb-validation](https://github.com/javadbat/jb-validation) inside to handle validation. so for more information you can read [jb-validation](https://github.com/javadbat/jb-validation) documentation.  
for simple usage you can set validation to your input:

```js
//you have 2 ways: 
//1- set list directly 
    titleInput.validation.list = [
        {
            validator: /.{3}/g,
            message: 'minimum length is 3 char'
        },
    //you can use function as a validator too
        {
            validator: ({displayValue,value})=>{return value == "hello"},
            message: 'you can only type hello'
        },
    //you can also return string in validator if you want custom error message in some edge cases
        {
            validator: ({displayValue,value})=>{
               if(value.includes("*")){
                return 'you cant write * in your text'
               }
               return true;
            },
            message: 'default error when return false'
        },
    ];
//2- pass a function that returns the validation list so on each validation process we execute your callback function and get the needed validation list
const result = document.getElementByTagName('jb-input').validation.addValidationListGetter(getterFunction)
```

## check validation

Like any other jb design system you can access validation by `validation` property:

```js
//access validation module
document.getElementByTagName('jb-input').validation
// check if input pass all the validations. showError is a boolean that determine your intent to show error to user on invalid status.
const result = await document.getElementByTagName('jb-input').validation.checkValidity({showError})
//or
const result = document.getElementByTagName('jb-input').validation.checkValiditySync({showError})
//return boolean of if inputted string is valid
const result = document.getElementByTagName('jb-input').checkValidity()
//or return boolean and show error
const result = document.getElementByTagName('jb-input').reportValidity()

```
## intercept user input

I don't recommend this in most cases but sometimes you need to change what user input in the text field or prevent user from typing or paste the wrong value into the field in this scenario we have a tools to let you do this. to doing so just register a interceptor function like this:

```ts
this.validation.addStandardValueCallback((inputtedString:string, oldValue:JBInputValue, prevResult:JBInputValue):JBInputValue=>{
    //here you can check new string, old value and  the value object that return by previous StandardValueCallback if you register multiple callback to modify value 
    return {
        // the value we return as dom.value
        value:string,
        //the value we ser into the input box that final user see
        displayValue:string
    }
});
```

## custom inputs
if you want something more than just simple input please check this components that use jb-input but add extra validation and input check layer for better user experience:   
- [jb-number-input](https://github.com/javadbat/jb-number-input) for input number
- [jb-payment-input](https://github.com/javadbat/jb-payment-input) for input bank card number and SHABA number
- [jb-date-input](https://github.com/javadbat/jb-date-input) for input date value
- [jb-national-input](https://github.com/javadbat/jb-national-input) for input national ID (کد ملی) value
- [jb-mobile-input](https://github.com/javadbat/jb-mobile-input) for input mobile value
- [jb-time-input](https://github.com/javadbat/jb-time-input) for input time value

### other attribute

| attribute name  | description                                                                                                        |
| -------------  | -------------                                                                                                       |
| name           | name you want to set to actual input element `<jb-input name="username"></jb-input>`                                |
| message        | in bottom of input we show small message for example "user name must be at least 5 char"                            |
| error          | error message to show under the input box                                                                           |
| autocomplete   | set autocomplete directly into dom element in case you need it                                                      |
| direction      | set web-component direction default set is rtl but if you need ltr use `<jb-input direction="ltr"></jb-input>`      |
| disabled       | disable the input                                                                                                   |
| inputmode      | set input mode help mobile device to open proper keyboard for your input like `url`, `search` and `numeric`         |
| required       | determine if input is required, used like:`<jb-input required />` or `<jb-input required="custom message"/>`        |
| size           | size of the input can be: 'xs' , 'sm' , 'md' , 'lg' , 'xl'                                                          |

### set custom style

you have 2 way to customize style,

1. using selectors like`:states` or `::part` selector
```css
jb-input::part(label){
  font-size: 2rem;
}
jb-input:states(invalid)::part(label){
  color:red;
}
```
we have `label`, `input-box`, `input`, `message` as a supported **part** in our component. you can also combine them with `disabled`, `invalid` **states** for different style in different states.

2. using css variable

| css variable name                  | description                                                                                   |
| -------------                      | -------------                                                                                 |
| --jb-input-margin                  | web-component margin default is `0 0`                                                         |
| --jb-input-border-radius           | web-component border-radius default is `16px`                                                 |
| --jb-input-border-color            | border color of select in normal mode                                                         |
| --jb-input-border-color-focus      | border color of select in normal mode                                                         |
| --jb-input-bgcolor                 | background color of input                                                                     |
| --jb-input-border-bottom-width     | border bottom thickness default is `3px`                                                      |
| --jb-input-label-font-size         | font size of input label default is `0.8em`                                                   |
| --jb-input-label-color             | change label color                                                                            |
| --jb-input-label-margin            | change label margin default is `0 4px`                                                        |
| --jb-input-message-font-size       | font size of message we show under input                                                      |
| --jb-input-message-color           | set under box message color                                                                   |
| --jb-input-message-error-color     | change color of error we show under input                                                     |
| --jb-input-height                  | height of input default is 40px                                                               |
| --jb-input-placeholder-color       | change placeholder color                                                                      |
| --jb-input-placeholder-font-size   | change placeholder font-size                                                                  |
| --jb-input-value-font-size         | input value font-size                                                                         |
| --jb-input-value-color             | input value color                                                                             |
| --jb-input-input-padding           | set input inner padding default is `2px 12px 0 12px`                                          |
| --jb-input-input-text-align        | set input element text align for example if you have number Input and want to make it left    |
| --jb-input-input-direction         | set input element direction to other than inherited value from it's parent element            |
| --jb-input-input-font-weight       | set input value font-weight default is `initial` (browser setting)                            |
| --jb-input-box-shadow              | set box shadow of input                                                                       |
| --jb-input-box-shadow-focus        | set box shadow of input on focus                                                              |
| --jb-input-border-width            | border width  default is `1px`                                                                |
| --jb-input-label-margin            | label margin default is `0`                                                                   |
| --jb-input-label-font-weight       | label font weight default is `300`                                                            |
| --jb-input-box-overflow            | input box overflow default is `hidden`                                                        |

## add custom element in input box

in jb-input you can put icon or any other custom html DOM in input box. to doing so you just have to place custom DOM in `jb-input` tag and add `slot="start-section"` or `slot="end-section"` to place it before or after input field.
example:

```HTML
<jb-input>
    <div slot="end-section">after</div>
    <div slot="start-section">before</div>
</jb-input>
```

## Other Related Docs:

- see [jb-input/react](https://github.com/javadbat/jb-input/tree/main/react) if you want to use this component in react.

- see [All JB Design system Component List](https://javadbat.github.io/design-system/) for more components.

- use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute in this component.