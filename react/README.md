# JBInput React

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-input)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-input/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-input-react)](https://www.npmjs.com/package/jb-input-react)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-input)

text input `react component` with these benefits:

- easy to add custom regex or function validation.

- multiple validation with different message.

- support both RTL and LTR.

- add label and message in UX friendly format.

- customizable ui with CSS variable so you can have multiple style in different scope of your app.

- support typescript.

- extendable so you can create your own custom input based on jb-input like [jb-number-input](https://github.com/javadbat/jb-number-input).

Try the [interactive component examples](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--overview), read the [React API docs](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-inputs-jbinput-react-readme--docs), or open the [CodeSandbox preview](https://3f63dj.csb.app/samples/jb-input) and [editor](https://codesandbox.io/p/sandbox/jb-design-system-3f63dj?file=%2Fsrc%2Fsamples%2FJBInput.tsx).

## When to use

Use `JBInput` for single-line text entry with JB Design System label, helper message, validation, form association, custom adornment slots, and shared input styling.

Use specialized inputs such as `JBNumberInput`, `JBMobileInput`, `JBDateInput`, or `JBPaymentInput` when the value has domain-specific formatting or validation.

## AI usage hints

- Import `JBInput` from `jb-input/react`; the wrapper imports and registers the underlying `jb-input` web component.
- Use `value` for controlled values and `onInput` for every user edit.
- Use `onChange` for committed changes, usually after blur.
- Pass custom validators with `validationList`.
- Use `required={true}` for default required validation or `required="Custom message"` for a custom required message.
- Use the exact event prop casing from this README, such as `onKeyDown`, `onKeyUp`, and `onBeforeInput`.
- Put adornments inside the component with `slot="inline-start"` or `slot="inline-end"`.
- Use `ref` when you need imperative methods such as `checkValidity()`, `reportValidity()`, or `focus()`.

## Installation
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

## Props

| prop | type | description |
| --- | --- | --- |
| `value` | `string \| number \| null \| undefined` | Controlled value. `null` and `undefined` are normalized to an empty string. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--test-actions) |
| `label` | `string` | Visible label text and accessible label. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--normal) |
| `message` | `string` | Helper text shown under the input when no validation error is visible. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--normal) |
| `placeholder` | `string` | Placeholder text. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--with-placeholder) |
| `name` | `string` | Form field name. |
| `type` | `string` | Native input type forwarded to the inner input. |
| `inputmode` | `string` | Native inputmode value such as `numeric`, `decimal`, `email`, `url`, or `search`. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--custom-mobile-keyboard) |
| `autocomplete` | `string` | Native autocomplete value. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Visual size variant. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--size-variants) |
| `disabled` | `boolean` | Disables the input. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--disabled) |
| `required` | `boolean \| string` | Enables required validation. A string is used as the required error message. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--required-with-custom-message) |
| `error` | `string` | External validation error message. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--with-error) |
| `validationList` | `ValidationItem<ValidationValue>[]` | Custom validation rules from `jb-validation`. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--validation-list) |

## Events
[Input, change, keyboard, and focus events](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--test-actions) · [Enter event](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--on-enter-test)
```jsx
    //when default property are defined best time for impl your config
    <JBInput onInit={(event) => {}}></JBInput>

    //when dom bound and rendered in browser dom 3 and you can access all property
    <JBInput onLoad={(event) => {}}></JBInput>

    //keyboard event
    <JBInput onKeyDown={(event) => console.log(event.target.value)}></JBInput>
    <JBInput onKeyUp={(event) => console.log(event.target.value)}></JBInput>
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

## get/set value

Use the controlled `value` prop for runtime updates. For imperative reads and writes, keep a ref to `JBInput`; the wrapper exposes the same `value`, `initialValue`, `displayValue`, and `isDirty` properties as the web component. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--direct-value-properties)

## required validation

Set `required` to `true` for the default message or pass a string for a custom message. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--required-with-custom-message)

## external error

Use the `error` prop when a form library or server response owns the validation message. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--with-error)



## set validation
You can set validation to your input by creating a validationList array and passing in to validationList props. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--validation-list)

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
You can check if an input value meet your validation standard by creating a ref of the element using `React.createRef()`. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--required-with-custom-message)
```javascript
    const elementRef = React.createRef();
    const isValid = elementRef.current.checkValidity();
    //if you want to show occurred error too
    const isValid = elementRef.current.reportValidity();
```
if `isValid` is `true` the value of input is valid.

if you want to show your own error message (you may get it from tanstack form or react hook form ,...) you can set `error` prop

```jsx
<JBInput error="your own error message"></JBInput>
```

## intercept user input

For value standardization, register `addStandardValueCallback` through a ref. The callback can return separate canonical and display values; the [standardization demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--standard-value-callback) filters non-numeric input as you type.

```tsx
import type { JBInputWebComponent } from 'jb-input';

const inputRef = useRef<JBInputWebComponent>(null);
useEffect(() => {
  inputRef.current?.addStandardValueCallback((text) => {
    const value = text.replace(/\D/g, '');
    return { value, displayValue: value };
  });
}, []);
```

## other props

| attribute name  | description                                                                                                         |
| -------------   | -------------                                                                                                       |
| name            | name you want to set to actual input element `<JBInput name="username"></JBInput>`                                  |
| message         | in bottom of input we show small message for example "user name must be at least 5 char"                            |
| error           | error message to show under the input box                                                                           |
| autocomplete    | set autocomplete directly into dom element in case you need it                                                      |
| direction       | set web-component direction default set is rtl but if you need ltr use `<JBInput direction="ltr"></JBInput>`        |
| disabled        | disable the input                                                                                                   |
| inputmode       | set input mode help mobile device to open proper keyboard for your input like `url`, `search` and `numeric`         |
| required        | determine if input is required, used like:`<JBInput required />` or `<JBInput required="custom message"/>`          |
| size            | size of the input can be: 'xs' , 'sm' , 'md' , 'lg' , 'xl'                                                          |


## set custom style
Since `jb-input-react` uses `jb-input` underneath, read the shared [web-component styling guidance](../README.md#css-parts-and-states) and browse the [styling guide](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput-styling--docs).

## add custom element in input box
In JBInput you can put icon or any other custom html DOM in input box. to doing so you just have to place custom DOM in JBInput tag and add `slot="inline-start"` or `slot="inline-end"` to place it before or after input field. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--with-start-and-inline-end)

``` javascript
<JBInput>
    <div slot="inline-end">after</div>
    <div slot="inline-start">before</div>
</JBInput>
```

## Slots

Use `slot="inline-start"` and `slot="inline-end"` for adornments around the native input. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput--with-start-and-inline-end)

## CSS parts and states
The React wrapper exposes the same styling contract shown in the [web-component CSS parts demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput-style--gallery).

The React wrapper exposes the same CSS parts, custom states, and variables as `jb-input`. Use `::part(...)` and CSS variables on the React component class name.

```css
.username-input::part(input) {
  text-align: left;
}

.username-input {
  --jb-input-border-radius: 0.5rem;
}
```

## Accessibility notes

Set `label` whenever the field does not already have an external accessible label. Keep custom `inline-start` and `inline-end` content decorative unless it is interactive and independently keyboard-accessible.

## Shared Documentation

For web-component behavior, events, slots, and CSS variables, see the shared [`jb-input` documentation](../README.md).

## Related Docs
- see [jb-input](https://github.com/javadbat/jb-input) if you want to use this component as a pure-js web-component

- see [All JB Design system Component List](https://javadbat.github.io/design-system/)

- use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute in this component.
