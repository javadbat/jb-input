import { useEvent } from "jb-core/react";
import { type EventTypeWithTarget } from "jb-core";
import { RefObject } from "react";
import { type JBInputWebComponent } from "jb-input";

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
  useEvent(element, 'enter', props.onEnter);
  useEvent(element, 'input', props.onInput);
  useEvent(element, 'beforeinput', props.onBeforeinput);
  useEvent(element, 'change', props.onChange);
  useEvent(element, 'keydown', props.onKeydown);
  useEvent(element, 'keyup', props.onKeyup);
  useEvent(element, 'focus', props.onFocus);
  useEvent(element, 'blur', props.onBlur);
}