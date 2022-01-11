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
}
export type ValidationResultSummary = {
    isValid:boolean | null;
    message:string | null;
}
export type ValidationResultItem = {
    isValid:boolean | null;
    message:string | null;
    validation:JBInputValidationItem;
}
export type ValidationResult = {
    validationList:ValidationResultItem[];
    isAllValid:boolean;
}
export type JBInputValidationItem = {
    validator: RegExp | ((value:string)=>boolean);
    message:string;
}
//becuase this._internal is not a standard we have to extend HTMLELEMENT to use it
declare global {
    interface ElementInternals{
        setFormValue(value:string):void;
    }
}