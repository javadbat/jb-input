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
type Paritial<T> = {
    [P in keyof T]?: T[P];
}
export type NumberFieldParameterInput = Paritial<NumberFieldParameter>;
export type JBInputStandardValueObject = {
    value:string;
    displayValue:string;
}
//becuase this._internal is not a standard we have to extend HTMLELEMENT to use it
declare global {
    interface ElementInternals{
        setFormValue(value:string):void;
    }
}