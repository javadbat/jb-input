import { type JBInputWebComponent } from "./jb-input";
import {type EventTypeWithTarget} from 'jb-core';
export type ElementsObject = {
    input: HTMLInputElement;
    inputBox: HTMLDivElement;
    label: HTMLLabelElement;
    labelValue: HTMLSpanElement;
    messageBox: HTMLDivElement;
    slots:{
        startSection:HTMLSlotElement;
        endSection:HTMLSlotElement;
    };
};
/**
 * @description "INPUT" is for onInput,  "SET_VALUE" is for when value set from outside of component by dom.value="" or in attribute value set, and change call in onChange mean's it execute after blur
 */
export type ValueSetterEventType = "INPUT" | "SET_VALUE" | "CHANGE"
/**
 * @description this function used by derived input component so they can make different between display value and value value.
 * @param prevResult result of prev callback function it maybe useful in some cases when user add chain of value standard
 * @param eventType when standard  value is called. its for filter some standard function in some events, for example disable min value check on input number and let user do blur before some standard function be applied  
 */
export type StandardValueCallbackFunc = (inputtedString:string, oldValue:JBInputValue, prevResult:JBInputValue, eventType:ValueSetterEventType)=>JBInputValue
export type JBInputValue = {
    // the value we return as dom.value
    value:string,
    //the value we ser into the input box that final user see
    displayValue:string
}
export type SupportedState = "disabled" | "invalid"
export type ValidationValue = JBInputValue;
//because this._internal is not a standard we have to extend HTML ELEMENT to use it
declare global {
    interface ElementInternals{
        setFormValue(value:string):void;
    }
}

export type JBInputEventType<TEvent> = EventTypeWithTarget<TEvent,JBInputWebComponent>