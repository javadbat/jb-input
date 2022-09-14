# jb-input

text input web component with this benefit:

- easy to add custom regex or function validation.

- multiple validation with different message.

- support both RTL and LTR.

- add label and message in UX frienly format.

- customizable ui with css variable sp you can have multiple style in different scope of your app.

- custom display for password input with show and hide trigger button.

- number input with thousand separator (1,000,000) and  +- button with keyboard support for up and down value with customizable step and preventable negative value.

- number input will accept persian number char and convert them to english char

sample: <https://codepen.io/javadbat/pen/dyNwddd>

## instructions

### install

#### using npm

```cmd
npm i jb-input
```

in one of your js in pag

```js
import 'jb-input';

```

in your html or jsx

```html
<jb-input class="" label="لیبل" message="متن ثابت زیر کادر متن"></jb-input>
```
#### using cdn

you can just add script tag to your html file and then use web component how ever you need

```HTML
<script src="https://cdn.skypack.dev/jb-input"></script>
```

### get/set value

```js
//get value
const inputValue = document.getElementByTagName('jb-input').value;
//set value
document.getElementByTagName('jb-input').value = "new string";
```

### events

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

### set validation

you can set validation to your input:

```js
    titleInput.validationList = [
        {
            validator: /.{3}/g,
            message: 'عنوان حداقل باید سه کاکتر طول داشته باشد'
        },
        #you can use function as a validator too
        {
            validator: (inputedText)=>{return inputedText == "سلام"},
            message: 'شما تنها میتوانید عبارت سلام را وارد کنید'
        },
    ]
```

### check validation

you can check is image input value meet your validation standad by `dom.checkValidity(showError)`
the `showError` parameter is optional and its defualt is true but you cant set it false so if value is invalid component dont react and show error to user and just return validation object.  
in `change` event we have detail object you can access it by `event.detail.isValid` so you can see in new value is a valid value or not this way is really useful when you dont access to DOM directly like what we have in js frameworks.

### number input extra feature

if you set `type="number"` jb-input will add some feature for you for example your input will only get number chart and wont accept other string and we add 2 `+` & `-` button to the input so user can change number without keyboard by just tap on these buttons. you can also use Up and Down arrow keys too increase or decrease number value in your field.   
jb-input will also let you control some aspect of user input too for example you can limit decimal precision or change increase/decrease step of `+` `-` button.   
too achive this you must call one function and set value you need to change.

#### number input events

click on `+` `-` button will call `onChange` event.

```javascript
    document.getElementByTagName('jb-input').setNumberFieldParameter({
        //how many number you want to + or  - on user press buttons or use arrow keys defualt is 1
        step:100,
        // how many decimal input accept defualt is infinty
        decimalPrecision:2,
        // what char replaced to input if user paste some illeglal value defualt is '' (empty string)
        invalidNumberReplacement:'0',
        // separate every 3 number with comma like 1000000 => 1,000,000
        useThousandSeparator:false,
        // which char we use to separate thousand number
        thousandSeparator:',',
        //can input accept negativenumber or not
        acceptNegative:true,
        // max number value user can input. if user input bigger number it will be set to max
        maxValue: 1000,
        //min number value user can input. if user input smaller number it will be set to this value.
        minValue:1
    })
```

### other attribute

| atribute name  | description                                                                                                         |
| -------------  | -------------                                                                                                       |
| name           | name you want to set to actual input element `<jb-input name="username"></jb-input>`                                |
| message        | in botton of input we show small message for example "user name must be at least 5 char"                            |
| autocomplete   | set autocomplete directly into dom element in case you need it                                                      |
| direction      | set web-component direction defualt set is rtl but if you need ltr use `<jb-input direction="ltr"></jb-input>`      |
| disabled       | disable the input                                                                                                   |
| inputmode      | set input mode help mobile device to open proper keyboard for your input like `url`, `search` and `numeric`         |

### set custome style

in some cases in your project you need to change defualt style of web-component for example you need zero margin or different border-radius and etc.    
if you want to set a custom style to this web-component all you need is to set css variable in parent scope of web-component 
| css variable name                  | description                                                                                   |
| -------------                      | -------------                                                                                 |
| --jb-input-margin                  | web-component margin defualt is `0 12px`                                                      |
| --jb-input-border-radius           | web-component border-radius defualt is `16px`                                                 |
| --jb-input-border-color            | border color of select in normal mode                                                         |
| --jb-input-border-color-focus      | border color of select in normal mode                                                         |
| --jb-input-bgcolor                 | background color of input                                                                     |
| --jb-input-border-bottom-width     | border bottom thickness desualt is `3px`                                                      |
| --jb-input-label-font-size         | font size of input label defualt is `0.8em`                                                   |
| --jb-input-label-color             | change label color defualt is `#1f1735`                                                       |
| --jb-input-message-font-size       | font size of message we show under input                                                      |
| --jb-input-message-color           | set under box message color defualt is `#929292`                                              |
| --jb-input-message-error-color     | change color of error we show under input defualt is `red`                                    |
| --jb-input-height                  | height of input defualt is 40px                                                               |
| --jb-input-placeholder-color       | change placeholder color                                                                      |
| --jb-input-placeholder-font-size   | change placeholder font-size                                                                  |
| --jb-input-value-font-size         | input value font-size                                                                         |
| --jb-input-value-color             | input value color                                                                             |
| --jb-input-input-padding           | set input inner padding default is `2px 12px 0 12px`                                          |
| --jb-input-input-text-align        | set input element text align for example if you have number Input and want to make it left    |
| --jb-input-input-direction         | set input element direction to other than inherited value from it's parent element            |
| --jb-input-box-shadow              | set box shadow of input                                                                       |
| --jb-input-box-shadow-focus        | set box shadow of input on focus                                                              |
| --jb-input-border-width            | border width  default is `1px`                                                                |
| --jb-input-label-margin            | label margin default is `0`                                                                   |
| --jb-input-label-font-weight       | label font weight default is `300`                                                            |
#### number input special style

| css variable name                        | description                                                                                   |
| -------------                            | -------------                                                                                 |
| --jb-input-increase-button-color         | + button fill color                                                                           |
| --jb-input-increase-button-color-hover   | + button fill color on hover                                                                  |
| --jb-input-decrease-button-color         | - button fill color                                                                           |
| --jb-input-decrease-button-color-hover   | - button fill color on hover                                                                  |
| --jb-input-number-button-width           | number input width                                                                            |
| --jb-input-number-button-height          | number input height                                                                           |
| --jb-input-decrease-button-border        | decrease button border                                                                        |
| --jb-input-increase-button-border        | increase button border                                                                        |
| --jb-input-increase-button-border-radius | increase button border-radius                                                                 |
| --jb-input-decrease-button-border-radius | decrease button border-radius                                                                 |
| --jb-input-increase-button-bg            | increase button background color                                                              |
| --jb-input-decrease-button-bg            | decrease button background color                                                              |

## add custom element in input box

in jb-input you can put icon or any other custom html DOM in input box. to doing so you just have to plae custom DOM in `jb-input` tag and add `slot="start-section"` or `slot="end-section"` to place it before or after input field.
for better result i suggest you use `jb-input-inbox-element` tag but its optional and you can use your own custom tag too.
`jb-input-inbox-element` will add some style to make sure your icon will place in center and will not overflow nad make your job easier if you want more controll you can skip it and use your own tag.
example:

```HTML
<jb-input>
    <jb-input-inbox-element slot="end-section">
        <div>after</div>
    </jb-input-inbox-element>
    <jb-input-inbox-element slot="start-section">
        <div>before</div>
    </jb-input-inbox-element>
</jb-input>
```