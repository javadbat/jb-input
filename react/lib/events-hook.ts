import { useEvent } from "jb-core/react";
import { type EventTypeWithTarget } from "jb-core";
import { RefObject } from "react";
import { type JBInputWebComponent } from "jb-input";

export type JBInputEvents<TElement extends JBInputWebComponent> = {
    onEnter?: (e: EventTypeWithTarget<CustomEvent,TElement>) => void,
    onInput?: (e: EventTypeWithTarget<InputEvent,TElement>) => void,
    onBeforeInput?: (e: EventTypeWithTarget<InputEvent,TElement>) => void,
    onFocus?: (e: EventTypeWithTarget<FocusEvent,TElement>) => void,
    onBlur?: (e: EventTypeWithTarget<FocusEvent,TElement>) => void,
    onKeyUp?: (e: EventTypeWithTarget<KeyboardEvent,TElement>) => void,
    onKeyDown?: (e: EventTypeWithTarget<KeyboardEvent,TElement>) => void,
    onChange?: (e: EventTypeWithTarget<Event,TElement>) => void,
}
export function useJBInputEvents<TElement extends JBInputWebComponent>(element:RefObject<TElement | null>,props:JBInputEvents<TElement>){
  useEvent(element, 'enter', props.onEnter);
  useEvent(element, 'input', props.onInput);
  useEvent(element, 'beforeinput', props.onBeforeInput);
  useEvent(element, 'change', props.onChange);
  useEvent(element, 'keydown', props.onKeyDown);
  useEvent(element, 'keyup', props.onKeyUp);
  useEvent(element, 'focus', props.onFocus);
  useEvent(element, 'blur', props.onBlur);
}