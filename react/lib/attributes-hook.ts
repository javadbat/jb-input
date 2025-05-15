import { JBInputWebComponent, type ValidationValue} from "jb-input";
import { type ValidationItem } from "jb-validation";
import { RefObject, useEffect } from "react";

export type JBInputAttributes = {
    message?: string,
    value?: string | number | null | undefined,
    validationList?: ValidationItem<ValidationValue>[],
    type?: string,
    placeholder?: string,
    disabled?: boolean,
    required?:boolean,
    inputmode?: string,
    label?: string,
    name?: string,
    error?: string,
}
export function useJBInputAttribute(element: RefObject<JBInputWebComponent>, props: JBInputAttributes) {
  useEffect(() => {
    let value = props.value;
    if (props.value == null || props.value === undefined) {
      value = '';
    }
    if (element && element.current && element.current) {
      element.current.value = value?.toString() || "";
    }
  }, [props.value]);
  useEffect(() => {
    if (props.type) {
      element?.current?.setAttribute('type', props.type);
    }
  }, [props.type]);
  useEffect(() => {
    if(props.name){
        element?.current?.setAttribute('name', props.name || '');
      }else{
        element?.current?.removeAttribute('name');
      }
  }, [props.name]);
  useEffect(() => {
    if (element && element.current) {
      element.current.validation.list = props.validationList || [];
    }
  }, [props.validationList]);
  useEffect(() => {
    element?.current?.setAttribute('label', props.label || "");
  }, [props.label]);
  useEffect(() => {
    if (typeof props.disabled == "boolean") {
      element?.current?.setAttribute('disabled', `${props.disabled}`);
    }
  }, [props.disabled]);
  useEffect(() => {
    if (typeof props.required == "boolean") {
      element?.current?.setAttribute('required', `${props.required}`);
    }
  }, [props.required]);
  useEffect(() => {
    if (props.inputmode) {
      element.current?.setAttribute('inputmode', props.inputmode);
    } else {
      element.current?.removeAttribute('inputmode');
    }
  }
  , [props.inputmode]);
  useEffect(() => {
    element?.current?.setAttribute('message', props.message || "");
  }, [props.message]);
  useEffect(() => {
    element?.current?.setAttribute('placeholder', props.placeholder || "");
  }, [props.placeholder]);
  useEffect(() => {
    if(props.error){
      element?.current?.setAttribute('error', props.error);
    }else{
      element?.current?.removeAttribute('error');
    }
  }, [props.error]);
}