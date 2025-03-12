import React, { useRef } from 'react';
import {JBInput} from 'jb-input/react';
import { JBInputWebComponent, ValidationValue } from 'jb-input';
import { ValidationItem } from 'jb-validation';


function JBInputValidationList(props:JBInputValidationListProps) {
  const inputValidation:ValidationItem<ValidationValue>[]=[
    {
      validator: props.inputRegex,
      message: props.inputMessage
    }
  ];
  const passwordValidation=[
    {
      validator: props.passwordRegex,
      message: props.passwordMessage
    }
  ];
  const emailValidation:ValidationItem<ValidationValue>[]=[
    {
      validator: props.emailRegex,
      message: props.emailMessage
    },
    {
      validator:({displayValue,value})=>{
        if(value.includes('yahoo')){
          return 'you cant enter yahoo email9';
        }
        return true;
      },
      message:"email must be gmail"
    },
    {
      validator:({displayValue,value})=>{
        return new Promise((resolve)=>{
          setTimeout(()=>{
            if(value.includes('outlook')){
              resolve('you cant enter outlook email') ;
            }
            resolve(true);
          },3000);
          
        });

      },
      message:"outlook doesn't respond",
      defer:true
    }
  ];
  const mobileValidation:ValidationItem<ValidationValue>[]=[
    {
      validator: props.mobileRegex,
      message: props.mobileMessage
    }
  ];
  
  const passwordInputDom = useRef<JBInputWebComponent>();
  function onButtonClicked(){
    if(passwordInputDom.current){
      console.log(passwordInputDom.current.validation.result);   
    }
  }

  return (
    <div style={{direction:'rtl'}}>
      <JBInput label='ورودی' validationList={inputValidation}></JBInput>
      <JBInput ref={passwordInputDom} label='رمز' validationList={passwordValidation}></JBInput>
      <JBInput label='ایمیل' validationList={emailValidation} message="enter outlook and see async validation result after 3sec"></JBInput>
      <JBInput label='شماره موبایل' validationList={mobileValidation}></JBInput>
      <JBInput label='پسورد' validationList={passwordValidation} type="password"></JBInput>
      <button onClick={onButtonClicked}>log password validation(see console)</button>
    </div>
  );
}
export type JBInputValidationListProps = {
  inputRegex: RegExp,
  inputMessage: string,
  passwordRegex: RegExp,
  passwordMessage: string,
  emailRegex: RegExp,
  emailMessage: string,
  mobileRegex: RegExp,
  mobileMessage: string,
};


export default JBInputValidationList;