# jb-input

## instructions

### get/set value

```js
const inputValue = document.getElementByTagName('jb-input').value;
document.getElementByTagName('jb-input').value = "new string";
```

### events

```js
document.getElementByTagName('jb-input').addEventListener('change',(event)=>{console.log(event.target.value)});
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

you can check is image input value meet your validation standad by `dom.triggerInputValidation(showError)`
the `showError` parameter is optional and its defualt is true but you cant set it false so if value is invalid component dont react and show error to user and just return validation object.  
in `change` event we have detail object you can access it by `event.detail.isValid` so you can see in new value is a valid value or not this way is really useful when you dont access to DOM directly like what we have in js frameworks.

### other attribute

| atribute name  | description                                                                                   |
| -------------  | -------------                                                                                 |
| name           | name you want to set to actual input element `<jb-input name="username"></jb-input>`          |
| message        | in botton of input we show small message for example "user name must be at least 5 char"      |
| autocomplete   | set autocomplete directly into dom element in case you need it                                |
