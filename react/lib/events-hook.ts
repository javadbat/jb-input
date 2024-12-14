import { RefObject, useCallback } from "react";
import { useBindEvent } from "../../../../common/hooks/use-event.js";
import { type JBInputWebComponent,EventTypeWithTarget} from "jb-input";

export type JBInputEvents<TElement extends JBInputWebComponent> = {
    onEnter?: (e: EventTypeWithTarget<CustomEvent,TElement>) => void,
    onInput?: (e: EventTypeWithTarget<InputEvent,TElement>) => void,
    onBeforeinput?: (e: EventTypeWithTarget<InputEvent,TElement>) => void,
    onFocus?: (e: EventTypeWithTarget<FocusEvent,TElement>) => void,
    onBlur?: (e: EventTypeWithTarget<FocusEvent,TElement>) => void,
    onKeyup?: (e: EventTypeWithTarget<KeyboardEvent,TElement>) => void,
    onKeydown?: (e: EventTypeWithTarget<KeyboardEvent,TElement>) => void,
    onChange?: (e: EventTypeWithTarget<Event,TElement>) => void,
}
export function useJBInputEvents<TElement extends JBInputWebComponent>(element:RefObject<TElement>,props:JBInputEvents<TElement>){
  const onChange = useCallback((e: EventTypeWithTarget<Event,TElement>) => {
    if (typeof props.onChange === "function") {
      props.onChange(e);
    }
  }, [props.onChange]);
  const onKeydown = useCallback((e:EventTypeWithTarget<KeyboardEvent,TElement>) => {
    if (typeof props.onKeydown === "function") {
      props.onKeydown(e);
    }
  }, [props.onKeydown]);
  const onKeyup = useCallback((e:EventTypeWithTarget<KeyboardEvent,TElement>) => {
    if (typeof props.onKeyup === "function") {
      props.onKeyup(e);
    }
  }, [props.onKeyup]);
    
  const onEnter = useCallback((e:EventTypeWithTarget<CustomEvent,TElement>) => {
    if (props.onEnter) {
      props.onEnter(e);
    }
  }, [props.onEnter]);
  const onFocus = useCallback((e: EventTypeWithTarget<FocusEvent,TElement>) => {
    if (props.onFocus && e instanceof FocusEvent) {
      props.onFocus(e);
    }
  }, [props.onFocus]);
  const onBlur = useCallback((e: EventTypeWithTarget<FocusEvent,TElement>) => {
    if (props.onBlur && e instanceof FocusEvent) {
      props.onBlur(e);
    }
  }, [props.onBlur]);
  const onInput = useCallback((e: EventTypeWithTarget<InputEvent,TElement>) => {
    if (typeof props.onInput == 'function' && e instanceof InputEvent) {
      props.onInput(e);
    }
  }, [props.onInput]);
  const onBeforeInput = useCallback((e: EventTypeWithTarget<InputEvent,TElement>) => {
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