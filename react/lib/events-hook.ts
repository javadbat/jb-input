import { useEvent } from "jb-core/react";
import type { EventTypeWithTarget } from "jb-core";
import { useCallback, type ChangeEvent, type RefObject } from "react";
import type { JBInputWebComponent } from "jb-input";

export type JBInputEvents<TElement extends JBInputWebComponent> = {
    onEnter?: (e: EventTypeWithTarget<CustomEvent,TElement>) => void,
    onInput?: (e: EventTypeWithTarget<InputEvent,TElement>) => void,
    onBeforeInput?: (e: EventTypeWithTarget<InputEvent,TElement>) => void,
    onFocus?: (e: EventTypeWithTarget<FocusEvent,TElement>) => void,
    onBlur?: (e: EventTypeWithTarget<FocusEvent,TElement>) => void,
    onKeyUp?: (e: EventTypeWithTarget<KeyboardEvent,TElement>) => void,
    onKeyDown?: (e: EventTypeWithTarget<KeyboardEvent,TElement>) => void,
    /**
    * React standard onChangeEvent
    */
    onChange?: React.ChangeEventHandler<TElement>,
    /**
    * native element change event (not react change event) may used by user in some scenario
    */
    onChangeNative?:(e:EventTypeWithTarget<Event,TElement>)=>void,
}
export function useJBInputEvents<TElement extends JBInputWebComponent>(element:RefObject<TElement | null>,props:JBInputEvents<TElement>){
  useEvent(element, 'enter', props.onEnter);
  useEvent(element, 'beforeinput', props.onBeforeInput);
  useEvent(element, 'keydown', props.onKeyDown);
  useEvent(element, 'keyup', props.onKeyUp);
  useEvent(element, 'focus', props.onFocus);
  useEvent(element, 'blur', props.onBlur);
  useEvent(element, 'input', props.onInput);
  useEvent(element, 'change', props.onChangeNative);

  const onChange = useCallback((e: ChangeEvent<TElement>)=>{
    props.onChange?.(e)
  },[props.onChange])
  return {onChange}
}