'use client';
import React, { useRef, useImperativeHandle, forwardRef, type PropsWithChildren } from 'react';
import 'jb-input';
// eslint-disable-next-line no-duplicate-imports
import { JBInputWebComponent, type JBInputEventType, type SizeVariants } from 'jb-input';
import { type JBInputEvents, useJBInputEvents } from './events-hook.js';
import { type JBInputAttributes, useJBInputAttribute } from './attributes-hook.js';
import type { JBElementStandardProps } from 'jb-core/react';
import './module-declaration.js';

export { type JBInputEvents, useJBInputEvents, type JBInputAttributes, useJBInputAttribute, type JBInputEventType };

export type DirectProps = {
  label?: string,
  message?: string,
  placeholder?: string,
  size?: SizeVariants,
  name?: string,
  type?: string,
  inputmode?: string,
  error?: string,
  autocomplete?:string,
  value?: string | number | null,
  initialValue?: string | number | null,
}

// eslint-disable-next-line react/display-name
export const JBInput = forwardRef((props: Props, ref) => {
  const element = useRef<JBInputWebComponent>(null);
  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  const { onBeforeinput, onBlur, onChange, onEnter, onFocus, onInput, onKeydown, onKeyup, size, autocomplete, disabled, error, initialValue, inputmode, label, message, name, placeholder, required, type, validationList, value, ...standardProps } = props;
  // props that directly set in jsx dom and need no process or property set
  const directProps: DirectProps = {
    label,
    message,
    name,
    placeholder,
    size,
    type,
    error,
    inputmode,
    autocomplete,
    value: value?.toString() ?? "",
    initialValue: initialValue?.toString() ?? "",
  }
  useJBInputEvents(element, { onBeforeinput, onBlur, onChange, onEnter, onFocus, onInput, onKeydown, onKeyup });
  useJBInputAttribute(element, { disabled, required, validationList });
  return (
    <jb-input ref={element} {...directProps} {...standardProps} >
      {props.children}
    </jb-input>
  );
});
//used in derived jb-input react components like number input.
export type BaseProps<T extends JBInputWebComponent> = PropsWithChildren<JBElementStandardProps<T,keyof JBInputAttributes & DirectProps>> & JBInputEvents<T> & JBInputAttributes & DirectProps;
export type Props = BaseProps<JBInputWebComponent>;
JBInput.displayName = "JBInput";

