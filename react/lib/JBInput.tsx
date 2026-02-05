'use client';
import React, { useRef, useEffect, useImperativeHandle, useState, DetailedHTMLProps, HTMLAttributes, forwardRef, type CSSProperties, type PropsWithChildren } from 'react';
import 'jb-input';
// eslint-disable-next-line no-duplicate-imports
import { JBInputWebComponent, type JBInputEventType, type SizeVariants } from 'jb-input';
import { type JBInputEvents, useJBInputEvents } from './events-hook.js';
import { type JBInputAttributes, useJBInputAttribute } from './attributes-hook.js';
import type { JBElementStandardProps } from 'jb-core/react';

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
  autocomplete?:string
}

type JBInputType = DetailedHTMLProps<HTMLAttributes<JBInputWebComponent>, JBInputWebComponent> & DirectProps
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-input': JBInputType;
    }
  }
}
// eslint-disable-next-line react/display-name
export const JBInput = forwardRef((props: Props, ref) => {
  const element = useRef<JBInputWebComponent>(null);
  useImperativeHandle(
    ref,
    () => (element ? element.current : {}),
    [element],
  );
  const { onBeforeinput, onBlur, onChange, onEnter, onFocus, onInput, onKeydown, onKeyup, size, autocomplete, disabled, error, inputmode, label, message, name, placeholder, required, type, validationList, value, ...standardProps } = props;
  // props that directly set in jsx dom and need no process or property set
  const directProps: Required<DirectProps> = { label, message, name, placeholder, size, type, error,inputmode, autocomplete }
  useJBInputEvents(element, { onBeforeinput, onBlur, onChange, onEnter, onFocus, onInput, onKeydown, onKeyup });
  useJBInputAttribute(element, { disabled, required, validationList, value });
  return (
    <jb-input ref={element} {...directProps} {...standardProps} >
      {props.children}
    </jb-input>
  );
});
//used in derived jb-input react components like number input.
export type BaseProps<T extends JBInputWebComponent> = PropsWithChildren<JBElementStandardProps> & JBInputEvents<T> & JBInputAttributes & DirectProps;
export type Props = BaseProps<JBInputWebComponent>;
JBInput.displayName = "JBInput";

