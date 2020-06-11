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
    titleInput.validationList = [{
            validator: /.{3}/g,
            message: 'عنوان حداقل باید سه کاکتر طول داشته باشد'
        }, ]
```

### check validation

you can check is image input value meet your validation standad by `dom.triggerInputValidation(showError)`
the `showError` parameter is optional and its defualt is true but you cant set it false so if value is invalid component dont react and show error to user and just return validation object