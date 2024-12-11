import React ,{ useRef, useEffect, useImperativeHandle, useState, DetailedHTMLProps, HTMLAttributes,forwardRef } from 'react';
import 'jb-input';
// eslint-disable-next-line no-duplicate-imports
import {JBInputWebComponent, JBInputEventType } from 'jb-input';
import { type JBInputEvents, useJBInputEvents } from './events-hook.js';
import { type JBInputAttributes, useJBInputAttribute } from './attributes-hook.js';

export { JBInputEvents, useJBInputEvents,JBInputAttributes, useJBInputAttribute, JBInputEventType};
interface JBInputType extends DetailedHTMLProps<HTMLAttributes<JBInputWebComponent>, JBInputWebComponent> {
  class?: string,
  label?: string,
  name?: string,
  message?: string,
  placeholder?:string,
  // ref:React.RefObject<JBDateInputWebComponent>,
}
declare global {
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
  const [refChangeCount, refChangeCountSetter] = useState(0);
  useImperativeHandle(
    ref,
    () => (element ? element.current : {}),
    [element],
  );
  //to force rerender for events
  useEffect(() => {
    refChangeCountSetter(refChangeCount + 1);
  }, [element.current]);
  useJBInputEvents(element,props);
  useJBInputAttribute(element,props);
  return (
    <jb-input ref={element} class={props.className}>
      {props.children}
    </jb-input>
  );
});
export type Props = JBInputEvents & JBInputAttributes & {
    className?: string,
    children?: React.ReactNode | React.ReactNode[],
}
JBInput.displayName = "JBInput";

