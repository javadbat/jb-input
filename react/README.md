# JBInput React

this component is React.js wrapper for [jb-input](https://www.npmjs.com/package/jb-input) web component.

text input `react component` with these benefits:

- easy to add custom regex or function validation.

- multiple validation with different message.

- support both RTL and LTR.

- add label and message in UX friendly format.

- customizable ui with css variable so you can have multiple style in different scope of your app.

- support typescript.

- extendable so you can create your own custom input base on jb-input like [jb-number-input](https://github.com/javadbat/jb-number-input).

Demo :  Demo: [codeSandbox preview](https://3f63dj.csb.app/samples/jb-input) for just see the demo and [codeSandbox editor](https://codesandbox.io/p/sandbox/jb-design-system-3f63dj?file=%2Fsrc%2Fsamples%2FJBInput.tsx) if you want to see and play with code

## install

### using npm

```sh
npm i jb-input
```
in your jsx file

```js
import {JBInput} from 'jb-input/react';
```

``` jsx
<JBInput label="label:" message="hint message under textbox"></JBInput>
```

## events

```jsx
    //when default property are defined best time for impl your config
    <JBInput onInit={(event) => {}}></JBInput>

    //when dom bound and rendered in browser dom 3 and you can access all property
    <JBInput onLoad={(event) => {}}></JBInput>

    //keyboard event
    <JBInput onKeyDown={(event) => console.log(event.target.value)}></JBInput>
    <JBInput onKeyUp={(event) => console.log(event.target.value)}></JBInput>
    <JBInput onKeyPress={(event) => console.log(event.target.value)}></JBInput>
    <JBInput onChange={(event) => console.log(event.target.value)}></JBInput>
    // when user press enter on type good for situation you want so submit form or call search function on user press enter. 
    <JBInput onEnter={(event) => console.log(event.target.value)}></JBInput>
    //focus event
    <JBInput onFocus={(event) => console.log(event.target.value)}></JBInput>
    <JBInput onBlur={(event) => console.log(event.target.value)}></JBInput>
    //input Event
    <JBInput onInput={(event) => console.log(event.target.value)}></JBInput>
    <JBInput onBeforeInput={(event) => console.log(event.target.value)}></JBInput>
```



## set validation

you can set validation to your input by creating a validationList array and passing in to validationList props:

``` javascript
    const validationList = [
        {
            validator: /.{3}/g,
            message: 'minimum length is 3 char'
        },
        #you can use function as a validator too
        {
            validator: ({displayValue,value})=>{return value == "hello"},
            message: 'you can only type hello'
        },
    ]
```
```jsx
    <JBInput validationList={validationList}></JBInput>
```

## check validation

you can check if an input value meet your validation standad by creating a ref of the element using `React.createRef()`.
```javascript
    const elementRef = React.createRef();
    const isValid = elementRef.current.checkValidity().isAllValid;
    //if you want to show occurred error too
    const isValid = elementRef.current.reportValidity().isAllValid;
```
if `isValid` is `true` the value of input is valid.

if you want to show your own error message (you may get it from tanstack form or react hook form ,...) you can set `error` prop

```jsx
<JBInput error="your own error message"></JBInput>
```

## other props

|props name | description        |
| --------- | ------------------ |
| disabled	| disable the input  |
| inputmode | set input mode help mobile device to open proper keyboard for your input like url, search and numeric |
| direction | set web-component direction default set is rtl but if you need ltr use <JBInput direction="ltr"></JBInput> |


## set custom style

since jb-input-react use jb-input underneath, read [jb-input](https://github.com/javadbat/jb-input) custom style section.

## add custom element in input box

in JBInput you can put icon or any other custom html DOM in input box. to doing so you just have to place custom DOM in JBInput tag and add `slot="start-section"` or `slot="end-section"` to place it before or after input field. 

``` javascript
<JBInput>
    <div slot="end-section">after</div>
    <div slot="start-section">before</div>
</JBInput>
```

## Other Related Docs:

- see [jb-input](https://github.com/javadbat/jb-input) if you want to use this component as a pure-js web-component

- see [All JB Design system Component List](https://javadbat.github.io/design-system/

- use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute in this component.