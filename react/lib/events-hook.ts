import { RefObject, useCallback } from "react";
import { useBindEvent } from "../../../../common/hooks/use-event.js";
import { type JBInputWebComponent, type JBInputEventType} from "jb-input";

export type JBInputEvents = {
    onEnter?: (e: JBInputEventType<CustomEvent>) => void,
    onInput?: (e: JBInputEventType<InputEvent>) => void,
    onBeforeinput?: (e: JBInputEventType<InputEvent>) => void,
    onFocus?: (e: JBInputEventType<FocusEvent>) => void,
    onBlur?: (e: JBInputEventType<FocusEvent>) => void,
    onKeyup?: (e: JBInputEventType<KeyboardEvent>) => void,
    onKeydown?: (e: JBInputEventType<KeyboardEvent>) => void,
    onChange?: (e: JBInputEventType<Event>) => void,
}
export function useJBInputEvents(element:RefObject<JBInputWebComponent>,props:JBInputEvents){
  const onChange = useCallback((e: JBInputEventType<Event>) => {
    if (typeof props.onChange === "function") {
      props.onChange(e);
    }
  }, [props.onChange]);
  const onKeydown = useCallback((e:JBInputEventType<KeyboardEvent>) => {
    if (typeof props.onKeydown === "function") {
      props.onKeydown(e);
    }
  }, [props.onKeydown]);
  const onKeyup = useCallback((e:JBInputEventType<KeyboardEvent>) => {
    if (typeof props.onKeyup === "function") {
      props.onKeyup(e);
    }
  }, [props.onKeyup]);
    
  const onEnter = useCallback((e:JBInputEventType<CustomEvent>) => {
    if (props.onEnter) {
      props.onEnter(e);
    }
  }, [props.onEnter]);
  const onFocus = useCallback((e: JBInputEventType<FocusEvent>) => {
    if (props.onFocus && e instanceof FocusEvent) {
      props.onFocus(e);
    }
  }, [props.onFocus]);
  const onBlur = useCallback((e: JBInputEventType<FocusEvent>) => {
    if (props.onBlur && e instanceof FocusEvent) {
      props.onBlur(e);
    }
  }, [props.onBlur]);
  const onInput = useCallback((e: JBInputEventType<InputEvent>) => {
    if (typeof props.onInput == 'function' && e instanceof InputEvent) {
      props.onInput(e);
    }
  }, [props.onInput]);
  const onBeforeInput = useCallback((e: JBInputEventType<InputEvent>) => {
    if (typeof props.onBeforeinput == 'function' && e instanceof InputEvent) {
      props.onBeforeinput(e);
    }
  }, [props.onBeforeinput]);
  useBindEvent(element, 'change', onChange);
  useBindEvent(element, 'keydown', onKeydown);
  useBindEvent(element, 'keyup', onKeyup);
  useBindEvent(element, 'focus', onFocus);
  useBindEvent(element, 'blur', onBlur);
  useBindEvent(element, 'enter', onEnter);
  useBindEvent(element, 'input', onInput);
  useBindEvent(element, 'beforeinput', onBeforeInput);
}