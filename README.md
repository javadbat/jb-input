# jb-input

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-input)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-input/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-input)](https://www.npmjs.com/package/jb-input)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-input)

text input web component with these benefit:

- easy to add custom regex or function validation.

- multiple validation with different message.

- support both RTL and LTR.

- add label and message in UX friendly format.

- customizable ui with CSS variable so you can have multiple style in different scope of your app.

- extendable so you can create your own custom input based on jb-input like [jb-number-input](https://github.com/javadbat/jb-number-input).

- can accept persian number char and convert them to english char in value.

## When to use

Use `jb-input` for a single-line text field that needs the JB Design System label, helper message, validation UI, form association, RTL/LTR support, or input adornment slots.

Use a more specific component when the value has a specialized format or interaction:

| Use case | Prefer |
| --- | --- |
| Numeric value with number-specific behavior | [`jb-number-input`](https://github.com/javadbat/jb-number-input) |
| Date value | [`jb-date-input`](https://github.com/javadbat/jb-date-input) |
| Time value | [`jb-time-input`](https://github.com/javadbat/jb-time-input) |
| Mobile number | [`jb-mobile-input`](https://github.com/javadbat/jb-mobile-input) |
| National ID | [`jb-national-input`](https://github.com/javadbat/jb-national-input) |
| Payment card or SHABA value | [`jb-payment-input`](https://github.com/javadbat/jb-payment-input) |

Do not use `jb-input` for multi-line text; use `jb-textarea` instead.

## Demo

- [codepen](https://codepen.io/javadbat/pen/dyNwddd)
- [storybook](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbinput)

## Using With JS Frameworks
- [<img src="https://img.shields.io/badge/React.js-jb--input%2Freact-000.svg?logo=react&logoColor=%2361DAFB" height="30" />](https://github.com/javadbat/jb-input/tree/main/react)

## Installation

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

you can just add script tag to your html file and then use web component however you need

```HTML
<script src="https://unpkg.com/jb-input/dist/JBInput.umd.js"></script>
```

## API reference

Use this section as a quick contract for the component. Some attributes and properties have more behavior details in their linked sections.

### Attributes

| name | type | default | description |
| --- | --- | --- | --- |
| [`value`](#getset-value) | `string` | `""` | Initial value attribute. Prefer the `value` property for programmatic updates. |
| `label` | `string` | `""` | Visible label text and accessible aria label. |
| `message` | `string` | `""` | Helper text shown under the input when no validation error is visible. |
| `name` | `string` | `""` | Form field name. Also forwarded to the inner native input. |
| `type` | `string` | browser default | Native input type. If set to `number`, `inputmode` becomes `numeric` when no `inputmode` is provided. |
| `placeholder` | `string` | `""` | Placeholder text forwarded to the inner native input. |
| `autocomplete` | `string` | browser default | Native autocomplete value forwarded to the inner input. |
| `inputmode` | `string` | browser default | Native inputmode value such as `text`, `numeric`, `decimal`, `email`, `url`, or `search`. |
| `virtualkeyboardpolicy` | `string` | browser default | Forwarded to the inner native input. |
| `readonly` | `boolean` | `false` | Forwarded to the inner native input. |
| `disabled` | `boolean` | `false` | Disables the input and sets the `disabled` custom state. |
| [`required`](#required-validation) | `boolean \| string` | `false` | Enables required validation. A string value is used as the required error message. |
| [`error`](#external-error) | `string` | `""` | External validation error message. |
| `disable-auto-validation` | `boolean` | `false` | Stops automatic validation on input and blur when set to `true` or an empty attribute. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `md` style defaults | Visual size variant. |

### Properties

| name | type | readonly | description |
| --- | --- | --- | --- |
| [`value`](#getset-value) | `string` | no | Canonical value submitted with forms and returned by `.value`. |
| `displayValue` | `string` | yes | Value rendered in the inner input after standardization. It can differ from `value`. |
| `initialValue` | `string` | no | Value used as the baseline for `isDirty`; default is `""`. |
| `validation` | `ValidationHelper<JBInputValue>` | yes | Validation helper from `jb-validation`; set `validation.list` for custom rules. |
| `disabled` | `boolean` | no | Enables or disables the component. |
| [`required`](#required-validation) | `boolean` | no | Enables required validation. |
| `isDirty` | `boolean` | yes | `true` when current `value` differs from `initialValue`. |
| `selectionStart` | `number \| null` | no | Forwarded to the inner input. |
| `selectionEnd` | `number \| null` | no | Forwarded to the inner input. |
| `selectionDirection` | `'forward' \| 'backward' \| 'none' \| null` | no | Forwarded to the inner input. |
| `validationMessage` | `string` | yes | Current native validation message from `ElementInternals`. |

### Methods

| name | returns | description |
| --- | --- | --- |
| `checkValidity()` | `boolean` | Runs validation without showing the error message. Dispatches `invalid` when invalid. |
| `reportValidity()` | `boolean` | Runs validation and shows the first error message. Dispatches `invalid` when invalid. |
| `focus()` | `void` | Focuses the inner native input. |
| `setSelectionRange(start, end, direction?)` | `void` | Forwards `setSelectionRange` to the inner input. |
| [`addStandardValueCallback(callback)`](#intercept-user-input) | `void` | Adds a value standardization callback that can change `value` and `displayValue`. |

## get/set value
Like normal native input you can get/set value like below or use html attribute.

The `value` attribute is useful for the initial value in markup. For runtime updates, use the `value` property. `jb-input` also supports value standardization, so the visible `displayValue` can be different from the submitted `.value`.

```js
//get value
const inputValue = document.querySelector('jb-input').value;
//set value
document.querySelector('jb-input').value = "new string";
```

```HTML
<jb-input value="your value" />
```

## required validation

Use `required` with no value for the default required message:

```html
<jb-input label="Username" required></jb-input>
```

Use `required="message"` when the required error text must be customized:

```html
<jb-input label="Username" required="Username is required"></jb-input>
```

## external error

Use the `error` attribute when validation is controlled outside of `jb-input`, for example by a form library or server response. The component observes this attribute and updates its validation UI when the value changes.

```html
<jb-input label="Username" error="This username is already taken"></jb-input>
```

Clear the external error by removing the attribute or setting it to an empty value.

## Events

| event | cancelable | when it fires | value access |
| --- | --- | --- | --- |
| `input` | yes | On each user edit, after `value` and `displayValue` are standardized. | `event.target.value` |
| `beforeinput` | yes | Before the inner input value changes. Call `event.preventDefault()` to block the edit. | `event.target.value` |
| `change` | native behavior | When the user commits the value, usually on blur. | `event.target.value` |
| `keydown` | yes | Re-dispatched from the inner input. | `event.target.value` |
| `keyup` | no | Re-dispatched from the inner input. | `event.target.value` |
| `keypress` | no | Re-dispatched from the inner input. | `event.target.value` |
| `enter` | no | On `keyup` when the user presses Enter. | `event.target.value` |
| `invalid` | no | When `checkValidity()` or `reportValidity()` finds an invalid value. | `event.target.validationMessage` |
| `load` | no | In `connectedCallback`, before `init`. | component instance |
| `init` | no | In `connectedCallback`, after initial attributes are applied. | component instance |

```js
const input = document.querySelector('jb-input');

input.addEventListener('input', (event) => {
  console.log(event.target.value);
});

input.addEventListener('change', (event) => {
  console.log(event.target.value);
});

input.addEventListener('enter', (event) => {
  console.log(event.target.value);
});
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
const result = document.querySelector('jb-input').validation.addValidationListGetter(getterFunction)
```

## check validation

Like any other jb design system you can access validation by `validation` property:

```js
//access validation module
document.querySelector('jb-input').validation
// check if input pass all the validations. showError is a boolean that determine your intent to show error to user on invalid status.
const result = await document.querySelector('jb-input').validation.checkValidity({showError})
//or
const result = document.querySelector('jb-input').validation.checkValiditySync({showError})
//return boolean of if inputted string is valid
const result = document.querySelector('jb-input').checkValidity()
//or return boolean and show error
const result = document.querySelector('jb-input').reportValidity()

```
## intercept user input

I don't recommend this in most cases but sometimes you need to change what user input in the text field or prevent user from typing or paste the wrong value into the field in this scenario we have a tools to let you do this. to doing so just register a interceptor function like this:

```ts
input.addStandardValueCallback((inputtedString:string, oldValue:JBInputValue, prevResult:JBInputValue):JBInputValue=>{
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

## Slots

| slot | description | example use |
| --- | --- | --- |
| `start-section` | Content rendered before the native input. | search icon, currency prefix, country code |
| `end-section` | Content rendered after the native input. | clear button, visibility toggle, unit suffix |

```html
<jb-input label="Amount" inputmode="decimal">
  <span slot="start-section">$</span>
  <span slot="end-section">USD</span>
</jb-input>
```

## CSS parts and states

| part | description |
| --- | --- |
| `label` | The label element. |
| `input-box` | The wrapper around the slots and inner input. |
| `input` | The inner native input. |
| `message` | The helper or validation message element. |

| custom state | description |
| --- | --- |
| `disabled` | Applied when `disabled` is true. |
| `invalid` | Applied while a validation error is visible. |

## Accessibility notes

- The component is form-associated and submits `value` as its form value.
- `label` is exposed as the component aria label.
- `message` is exposed as the component aria description when no validation error is visible.
- `placeholder` is forwarded to the inner input and exposed as aria placeholder.
- `disabled`, `invalid`, and validation state are synchronized with `ElementInternals` where the browser supports it.
- The shadow root uses `delegatesFocus`, so focusing `<jb-input>` focuses the inner native input.

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
jb-input:states(invalid)::part(input-box){
  border-color:red;
}
jb-input:states(disabled)::part(input){
  cursor:not-allowed;
}
```
we have `label`, `input-box`, `input`, `message` as a supported **part** in our component. you can also combine them with `disabled`, `invalid` **states** for different style in different states.

2. using CSS variable

For complete styling guidance, live examples, official parts and states, and the full CSS variable reference, see [Styling](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-inputs-jbinput-styling).

## Related Docs
- see [jb-input/react](https://github.com/javadbat/jb-input/tree/main/react) if you want to use this component in react.

- see [All JB Design system Component List](https://javadbat.github.io/design-system/) for more components.

- use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute in this component.

## AI agent notes

This package includes [`custom-elements.json`](./custom-elements.json) so documentation tools, IDEs, and AI coding agents can discover the tag name, attributes, events, slots, CSS parts, and public methods.

- Import `jb-input` once before using `<jb-input>`.
- Use `.value` for the canonical value and `.displayValue` for the visible standardized value.
- Listen to `input` for every user edit and `change` for committed changes.
- Prefer the specialized JB inputs listed in [When to use](#when-to-use) for formatted values.
- Set `error` for externally controlled validation errors; the component observes the attribute and updates its validation UI.
