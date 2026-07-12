import { Fragment, useEffect, useRef, useState } from 'react';
import { JBInput } from 'jb-input/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JBInputWebComponent, ValidationValue } from 'jb-input';
import type { ValidationItem } from 'jb-validation';
import { JBButton } from 'jb-button/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import './styles/styles.css';
import { getInput, getInputBox, getMessageText, getNativeInput } from './test-utils';

const meta = {
  title: "Components/form elements/Inputs/JBInput",
  component: JBInput,
} satisfies Meta<typeof JBInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'placeholder',
    disabled: false
  }
};

export const DirectValueProperties: Story = {
  args: {
    value: 'current value',
    initialValue: 'initial value',
  },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    const nativeInput = getNativeInput(input);

    await waitFor(() => {
      expect(input.value).toBe('current value');
      expect(input.initialValue).toBe('initial value');
      expect(nativeInput.value).toBe('current value');
      expect(input.isDirty).toBe(true);
    });
  },
};



export const Required: Story = {
  args: {
    message: "focus on input write nothing then unfocus(blur) the input and see error message. then write something to make message disappear",
    required: true,
  }
}

export const Disabled: Story = {
  args: {
    label: 'disabled input',
    message: 'static text under input show all the time',
    value: 'value',
    disabled: true
  },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    const nativeInput = getNativeInput(input);
    const onInput = fn();

    input.addEventListener('input', onInput);

    await waitFor(() => {
      expect(input.disabled).toBe(true);
      expect(nativeInput.disabled).toBe(true);
      expect(nativeInput.value).toBe('value');
    });

    input.focus();
    await userEvent.click(nativeInput);
    await userEvent.type(nativeInput, ' updated');

    expect(nativeInput.value).toBe('value');
    expect(input.value).toBe('value');
    expect(onInput).not.toHaveBeenCalled();
  }
};


export const RequiredWithLabel: Story = {
  args: {
    label: "name",
    message: "focus on input write nothing then unfocus(blur) the input and see error message. then write something to make message disappear",
    required: true,
  }
}
export const RequiredWithCustomMessage: Story = {
  args: {
    label: "Required with custom message",
    message: "focus on input write nothing then unfocus(blur) the input and see error message. then write something to make message disappear",
    required: "you must fill this field to continue",
  },
  play: async ({ canvasElement, args }) => {
    const input = getInput(canvasElement);

    expect(input.reportValidity()).toBe(false);

    await waitFor(() => {
      expect(getMessageText(input)).toBe(args.required);
      expect(input.hasState('invalid')).toBe(true);
    });

    input.value = 'filled';
    expect(input.reportValidity()).toBe(true);

    await waitFor(() => {
      expect(getMessageText(input)).toBe(args.message);
      expect(input.hasState('invalid')).toBe(false);
    });
  }
}

export const WithError: Story = {
  args: {
    label: 'has error message',
    message: 'simple hint message',
    error: 'error message',
    validationList: [{ validator: /^.{3,}$/g, message: 'you must enter at least 3 characters' }],
    type: 'password'
  },
  play: async ({ canvasElement, args }) => {
    const input = getInput(canvasElement);

    await waitFor(() => {
      expect(input.reportValidity()).toBe(false);
      expect(getMessageText(input)).toBe(args.error);
    });

    input.value = 'ab';
    input.setAttribute('error', '');

    await waitFor(() => {
      expect(input.reportValidity()).toBe(false);
      expect(getMessageText(input)).toBe('you must enter at least 3 characters');
      expect(input.hasState('invalid')).toBe(true);
    });

    input.value = 'abcd';
    expect(input.reportValidity()).toBe(true);

    await waitFor(() => {
      expect(getMessageText(input)).toBe(args.message);
      expect(input.hasState('invalid')).toBe(false);
    });
  }
};

export const WithPlaceholder: Story = {
  args: {
    label: 'with placeholder',
    placeholder: 'test placeholder'
  }
};
export const SizeVariants: Story = {
  render: () => {
    return (<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
      <JBInput label='xl size' message="message underneath" size='xl'></JBInput>
      <JBInput label='xl size' placeholder="placeholder" size='xl'></JBInput>
      <JBInput label='xl size' value="Value 1234" size='xl'></JBInput>

      <JBInput label='lg size' message="message underneath" size='lg'></JBInput>
      <JBInput label='lg size' placeholder="placeholder" size='lg'></JBInput>
      <JBInput label='lg size' value="Value 1234" size='lg'></JBInput>

      <JBInput label='md size' message="message underneath" size='md'></JBInput>
      <JBInput label='md size' placeholder="placeholder" size='md'></JBInput>
      <JBInput label='md size' value="Value 1234" size='md'></JBInput>

      <JBInput label='sm size' message="message underneath" size='sm'></JBInput>
      <JBInput label='sm size' placeholder="placeholder" size='sm'></JBInput>
      <JBInput label='sm size' value="Value 1234" size='sm'></JBInput>

      <JBInput label='xs size' message="message underneath" size='xs'></JBInput>
      <JBInput label='xs size' placeholder="placeholder" size='xs'></JBInput>
      <JBInput label='xs size' value="Value 1234" size='xs'></JBInput>
    </div>)
  }
}
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
        <input data-testid="mirror-input" value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    const nativeInput = getNativeInput(input);
    const mirrorInput = within(canvasElement).getByTestId('mirror-input') as HTMLInputElement;

    await waitFor(() => {
      expect(nativeInput.value).toBe('09');
      expect(mirrorInput.value).toBe('09');
    });

    await userEvent.click(mirrorInput);
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    await userEvent.type(mirrorInput, '12345');

    await waitFor(() => {
      expect(input.value).toBe('12345');
      expect(nativeInput.value).toBe('12345');
    });

    nativeInput.focus();
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    await userEvent.type(nativeInput, '678');

    await waitFor(() => {
      expect(input.value).toBe('678');
      expect(mirrorInput.value).toBe('678');
    });
  }
};

export const OnEnterTest: Story = {
  args: {
    label: "enter test",
    message: 'Press Enter to see alert',
    onEnter: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const input = getInput(canvasElement);
    const nativeInput = getNativeInput(input);

    nativeInput.focus();
    nativeInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true, composed: true }));

    await waitFor(() => {
      expect(args.onEnter).toHaveBeenCalled();
    });
  }
}

export const LargeText: Story = {
  args: {
    label: 'large text to test what will happen if we set long text as an label to input',
    message: 'long message text to test what happen we we set long message as an message prop. you can also try responsiveness control to see what happen in mobile or tablet size',
  }
};

export const testStyles: Story = {
  render: () => (
    <div className="jb-input-styling-test">
      <h1>JBInput different Styling test</h1>
      <div className="cloudy-style">
        <JBInput />
      </div>
      <a href='https://github.com/javadbat/jb-input/blob/main/stories/styles/styles.css' target='_blank' rel="noopener">see css styles here</a>
    </div>
  )
};


export const ValidationList: StoryObj = {
  render: () => {
    const inputValidation: ValidationItem<ValidationValue>[] = [
      {
        validator: /^.{8,}$/g,
        message: 'you must enter 8 char at least'
      }
    ];
    const passwordValidation = [
      {
        validator: /.{8,}/g,
        message: 'password must at least 8 char long'
      },
      {
        validator: /(?=.*?[0-9])/g,
        message: 'password should include one number'
      },
      {
        validator: /(?=.*?[a-z])/g,
        message: 'password must include one word'
      }
    ];
    const emailValidation: ValidationItem<ValidationValue>[] = [
      {
        validator: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g,
        message: 'email is not valid'
      },
      {
        validator: ({ displayValue:_, value }) => {
          if (value.includes('yahoo')) {
            return 'you cant enter yahoo email9';
          }
          return true;
        },
        message: "email must be gmail"
      },
      {
        validator: ({ displayValue:_, value }) => {
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
        validator: /^(\+98|0|0098)?9\d{9}$/g,
        message: 'mobile number is not valid'
      }
    ];

    const passwordInputDom = useRef<JBInputWebComponent>(null);
    function onButtonClicked() {
      if (passwordInputDom.current) {
        console.log(passwordInputDom.current.validation.result);
      }
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <JBInput label='input' validationList={inputValidation}></JBInput>
        <JBInput label='email' validationList={emailValidation} message="enter outlook and see async validation result after 3sec"></JBInput>
        <JBInput label='phone number' validationList={mobileValidation} message='you can use jb-mobile-input for better experience'></JBInput>
        <JBInput ref={passwordInputDom} label='password' validationList={passwordValidation}></JBInput>
        <JBButton onClick={onButtonClicked}>log password validation(see console)</JBButton>
      </div>
    );
  },
  args: {
  },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    const nativeInput = getNativeInput(input);

    await userEvent.type(nativeInput, 'short');
    nativeInput.blur();

    await waitFor(() => {
      expect(input.reportValidity()).toBe(false);
      expect(getMessageText(input)).toBe('you must enter 8 char at least');
      expect(input.hasState('invalid')).toBe(true);
    });

    nativeInput.focus();
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    await userEvent.type(nativeInput, 'long-enough');

    await waitFor(() => {
      expect(input.reportValidity()).toBe(true);
      expect(input.hasState('invalid')).toBe(false);
    });
  }
};

export const WithStartSection: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'place holder',
    children: <div slot="start-section" style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#262626' }}></div>
  }
};


export const WithEndSection: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'place holder',
    children: <div slot="end-section" style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#262626' }}></div>
  }
};

export const WithStartAndEndSection: Story = {
  args: {
    label: 'label',
    message: 'static text under input show all the time',
    placeholder: 'place holder',
    children: (
      <Fragment>
        <div slot="end-section" style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#262626' }}></div>
        <div slot="start-section" style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#262626' }}></div>
      </Fragment>)
  }
};

export const CustomMobileKeyboard: Story = {
  args: {
    'label': 'number keyboard',
    'inputmode': 'numeric'
  },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    const nativeInput = getNativeInput(input);
    const inputBox = getInputBox(input);

    await waitFor(() => {
      expect(nativeInput.inputMode).toBe('numeric');
      expect(inputBox).toBeTruthy();
    });
  }
};
