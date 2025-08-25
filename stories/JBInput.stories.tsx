import React, { Fragment, useEffect, useRef, useState } from 'react';
import { JBInput, Props } from 'jb-input/react';
import type { Meta, StoryObj } from '@storybook/react';
import type { JBInputWebComponent, ValidationValue } from 'jb-input';
import type { ValidationItem } from 'jb-validation';
import {JBButton} from 'jb-button/react'
import './styles/styles.css';

const meta: Meta<Props> = {
  title: "Components/form elements/Inputs/JBInput",
  component: JBInput,
};
export default meta;
type Story = StoryObj<typeof JBInput>;

export const Normal: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'place holder',
    disabled: false
  }
};

export const Large: Story = {
  args: {
    label: 'متن ساختگی جهت نمایش در لیبل برای تست کردن طول کاراکترها و اندازه ی صفحه و زیر هم شدن متن در اندازه صفحه کوچک مثلا در سایز موبایل. این یک متن ساختگی می باشد',
    message: 'متن ساختگی جهت نمایش در پیام برای تست کردن طول کاراکترها و اندازه ی صفحه و زیر هم شدن متن در اندازه صفحه کوچک مثلا در سایز موبایل. این یک متن ساختگی می باشد',
  }
};

export const WithError: Story = {
  args: {
    label: 'has error message',
    message: 'simple hint message',
    error: 'error message',
    validationList: [{ validator: /^.{3,}$/g, message: 'you must enter at least 3 characters' }],
    type: 'password'
  }
};

export const WithPlaceholder: Story = {
  args: {
    label: 'with placeholder',
    placeholder: 'test placeholder'
  }
};

export const testActions: Story = {
  render: () => {
    const input = useRef<JBInputWebComponent>(null);
    const [value, setValue] = useState('09');
    useEffect(() => {
      input.current?.focus();
    }, []);
    return (
      <div>
        <JBInput ref={input} value={value} onKeyup={e => setValue(e.target.value)} onKeydown={(e) => { console.log(e); }} label="type value" message='native input and JB Input value must be sync'></JBInput>
        <br />
        <span>value:</span>
        <input value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  }
};

export const OnEnterTest: Story = {
  args: {
    label: "enter test",
    message: 'Press Enter to see alert',
    onEnter: () => { alert('you press Enter'); }
  }
}

export const testStyles: Story = {
  render: () => (
    <div className="jb-input-styling-test">
      <h1>JBInput different Styling test</h1>
      <div className="cloudy-style">
        <JBInput />
      </div>
      <a href='https://github.com/javadbat/jb-input/blob/main/stories/styles/styles.css' target='_blank'>see css styles here</a>
    </div>
  )
};


export const ValidationList: StoryObj = {
  render: (props:Record<string,any>) => {
    const inputValidation: ValidationItem<ValidationValue>[] = [
      {
        validator: props.inputRegex,
        message: props.inputMessage
      }
    ];
    const passwordValidation = [
      {
        validator: props.passwordRegex,
        message: props.passwordMessage
      }
    ];
    const emailValidation: ValidationItem<ValidationValue>[] = [
      {
        validator: props.emailRegex,
        message: props.emailMessage
      },
      {
        validator: ({ displayValue, value }) => {
          if (value.includes('yahoo')) {
            return 'you cant enter yahoo email9';
          }
          return true;
        },
        message: "email must be gmail"
      },
      {
        validator: ({ displayValue, value }) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              if (value.includes('outlook')) {
                resolve('you cant enter outlook email');
              }
              resolve(true);
            }, 3000);

          });

        },
        message: "outlook doesn't respond",
        defer: true
      }
    ];
    const mobileValidation: ValidationItem<ValidationValue>[] = [
      {
        validator: props.mobileRegex,
        message: props.mobileMessage
      }
    ];

    const passwordInputDom = useRef<JBInputWebComponent>(null);
    function onButtonClicked() {
      if (passwordInputDom.current) {
        console.log(passwordInputDom.current.validation.result);
      }
    }

    return (
      <div style={{display:'flex',flexDirection:'column', gap:'0.5rem'}}>
        <JBInput label='input' validationList={inputValidation}></JBInput>
        <JBInput label='email' validationList={emailValidation} message="enter outlook and see async validation result after 3sec"></JBInput>
        <JBInput label='phone number' validationList={mobileValidation} message='you can use jb-mobile-input for better experience'></JBInput>
        <JBInput ref={passwordInputDom} label='password' validationList={passwordValidation}></JBInput>
        <JBButton onClick={onButtonClicked}>log password validation(see console)</JBButton>
      </div>
    );
  },
  args: {
    inputRegex: /^.{8,}$/g,
    inputMessage: 'you must enter 8 char at least',
    passwordRegex: /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g,
    passwordMessage: 'password must include one word one number and at least 8 char long',
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g,
    emailMessage: 'email is not valid',
    mobileRegex: /^(\+98|0|0098)?9\d{9}$/g,
    mobileMessage: 'mobile number is not valid',
  }
};

export const WithStartSection: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'place holder',
    children: <div slot="start-section" style={{ width: '24px', height: '24px', backgroundColor: '#262626' }}></div>
  }
};


export const WithEndSection: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'place holder',
    children: <div slot="end-section" style={{ width: '24px', height: '24px', backgroundColor: '#262626' }}></div>
  }
};

export const WithStartAndEndSection: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'place holder',
    children: (
      <Fragment>
        <div slot="end-section" style={{ width: '24px', height: '24px', backgroundColor: '#262626' }}></div>
        <div slot="start-section" style={{ width: '24px', height: '24px', backgroundColor: '#262626' }}></div>
      </Fragment>)
  }
};

export const CustomMobileKeyboard: Story = {
  args: {
    'label': 'number keyboard',
    'inputmode': 'numeric'
  }
};