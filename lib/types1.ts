export type ElementsObject = {
    input: HTMLInputElement;
    inputBox: HTMLDivElement;
    label: HTMLLabelElement;
    labelValue: HTMLSpanElement;
    messageBox: HTMLDivElement;
    passwordTrigger: HTMLDivElement;
    [key: string]: HTMLElement;
};
export type NumberFieldParameter = {
    step:number;
    decimalPrecision:number | null;
    invalidNumberReplacement:string;
    useThousandSeparator:boolean;
    thousandSeparator:string;
    acceptNegative:boolean;
    maxValue:number | null;
    minValue:number | null;
    showButtons:boolean;
    showPersianNumber:boolean;
}
/**
 * @description this function used by derived input component so they can make different between display value and value value.
 * @param prevResult result of prev callback function it maybe useful in some cases when user add chain of value standard
 */
export type StandardValueCallbackFunc = (inputtedString:string, oldValue:JBInputValue, prevResult:JBInputValue)=>JBInputValue
type Partial<T> = {
    [P in keyof T]?: T[P];
}
export type NumberFieldParameterInput = Partial<NumberFieldParameter>;
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