import { enToFaDigits } from "../../../common/js/PersianHelper";
import { JBInputStandardValueObject, NumberFieldParameter } from "./Types";

export function standardValueForNumberInput(inputValueString:string, numberFieldParameters:NumberFieldParameter):JBInputStandardValueObject{
    if(inputValueString == '-' && numberFieldParameters!.acceptNegative == true){
        //if user type - and we accept negative number we let user to continue typing
        return {
            displayValue:inputValueString,
            value:inputValueString
        };
    }
    let valueString = inputValueString;
    //if  comma separator is used we need to remove it
    if(numberFieldParameters && numberFieldParameters.useThousandSeparator){
        valueString = valueString.replace(new RegExp(`${numberFieldParameters.thousandSeparator}`,'g'), '');
    }
    //if our input type is number and user want to set it to new value we do nececcery logic here
    let value = Number(valueString);
    if (isNaN(value)) {
        //replace arabic and persian number
        valueString = valueString.replace(/\u06F0/g, '0').replace(/\u06F1/g, '1').replace(/\u06F2/g, '2').replace(/\u06F3/g, '3').replace(/\u06F4/g, '4').replace(/\u06F5/g, '5').replace(/\u06F6/g, '6').replace(/\u06F7/g, '7').replace(/\u06F8/g, '8').replace(/\u06F9/g, '9');
        value = parseFloat(valueString);
        //if invalidity is not for persian number
        if(isNaN(value)){
            //we change nothing
            valueString = numberFieldParameters!.invalidNumberReplacement;
        }
    }
    //add max and min checker to prevent bigger value assignment
    if(numberFieldParameters.maxValue && value> numberFieldParameters.maxValue){
        value = numberFieldParameters.maxValue;
        valueString = `${numberFieldParameters.maxValue}`;
    }
    if(numberFieldParameters.minValue && value< numberFieldParameters.minValue){
        value = numberFieldParameters.minValue;
        valueString = `${numberFieldParameters.minValue}`;
    }
    const[integerNums, decimalNums] = valueString.split('.');
    
    const decimalPrecisionCount = decimalNums ? decimalNums.length : 0;
    if (numberFieldParameters && !(numberFieldParameters.decimalPrecision === null || numberFieldParameters.decimalPrecision == undefined) && decimalPrecisionCount && decimalPrecisionCount > numberFieldParameters.decimalPrecision) {
        // truncate extra decimal
        const checkRegex = new RegExp(`^-?\\d+(?:\\.\\d{0,${numberFieldParameters!.decimalPrecision}})?`);
        const match = valueString.match(checkRegex);
        if (match && match[0]) {
            valueString = match[0];
        }
    }
    //remove start zero when number is more than one digit 065 => 65
    if(integerNums.startsWith('0') && integerNums.length > 1){
        valueString = valueString.substring(1);
    }
    if( integerNums.startsWith('-') && integerNums.charAt(1) == '0' && integerNums.length > 2){
        valueString = '-'+valueString.substring(2);
    }
    // check for negative value
    if(numberFieldParameters && numberFieldParameters.acceptNegative == false && integerNums.startsWith('-')){
        valueString = numberFieldParameters!.invalidNumberReplacement;
        console.error('negative number is not allowed change numberFieldParameters.acceptNegative to true to allow negative numbers');
    }
    const standardValueObject: JBInputStandardValueObject = {
        displayValue: valueString,
        value: valueString,
    };
    // add thousand separator comma
    if(numberFieldParameters && numberFieldParameters.useThousandSeparator){
        standardValueObject.displayValue = valueString.replace(/\B(?=(\d{3})+(?!\d))/g, numberFieldParameters.thousandSeparator);
    }
    //convert en number to persian number
    if(numberFieldParameters && numberFieldParameters.showPersianNumber){
        standardValueObject.displayValue = enToFaDigits(standardValueObject.displayValue);
    }
    return standardValueObject;
}