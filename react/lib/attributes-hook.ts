import { type JBInputWebComponent, type ValidationValue } from "jb-input";
import { type ValidationItem } from "jb-validation";
import { type RefObject, useEffect } from "react";

export type JBInputAttributes = {
  validationList?: ValidationItem<ValidationValue>[],
  disabled?: boolean,
  required?: boolean | string,
}
export function useJBInputAttribute<TElement extends JBInputWebComponent>(element: RefObject<TElement | null>, props: JBInputAttributes) {
  useEffect(() => {
    if (element && element.current) {
      element.current.validation.list = props.validationList || [];
    }
  }, [props.validationList]);

  useEffect(() => {
    if (typeof props.disabled == "boolean" && props.disabled) {
      element?.current?.setAttribute('disabled', '');
    } else {
      element?.current?.removeAttribute('disabled');
    }
  }, [props.disabled]);

  useEffect(() => {
    if (typeof props.required === "string") {
      element?.current?.setAttribute('required', props.required);
    }
    if (typeof props.required === "boolean") {
      props.required?element?.current?.setAttribute('required', ''):element?.current?.removeAttribute('required');
    }
  }, [props.required]);
}
