import { type JBInputWebComponent } from "./jb-input";

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
 * @description this function used by derived input component so they can make different between display value and value value.
 * @param prevResult result of prev callback function it maybe useful in some cases when user add chain of value standard
 */
export type StandardValueCallbackFunc = (inputtedString:string, oldValue:JBInputValue, prevResult:JBInputValue)=>JBInputValue
export type JBInputValue = {
    // the value we return as dom.value
    value:string,
    //the value we ser into the input box that final user see
    displayValue:string
}
export type ValidationValue = JBInputValue;
//because this._internal is not a standard we have to extend HTML ELEMENT to use it
declare global {
    interface ElementInternals{
        setFormValue(value:string):void;
    }
}
export type JBInputEventType<T> = T & {
    target: JBInputWebComponent
}