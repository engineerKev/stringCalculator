import React, { useState } from 'react';

import Button from '../../components/UI/Button/Button';

import classes from './StringCalculator.module.css';

const stringCalculator = (props) => {
    const [inputStateVal, setInputStateVal] = useState("");
    const [inputNumArray, setInputNumArray] = useState([0]);
    const [exception, setException] = useState("")
    const [result, setResult ] = useState(null);
    const { placeHolderText } = props;

    const returnCustomDelimeters = ()  => {

        const anyLengthCustomDelimeterRegex = /(\/{2}\[(.*)\])/g;
        const dirtyAnyLengthCustomDelimeter = inputStateVal.match(anyLengthCustomDelimeterRegex);
        const anyLengthCleanUpRegex = /[\[\]\/]/g;
        const cleanAnyLengthCustomDelimeter = dirtyAnyLengthCustomDelimeter && dirtyAnyLengthCustomDelimeter.pop().replace(anyLengthCleanUpRegex, "");

        const anySingleCustomDelimeterRegex = /(\/{2}[^\d])/g;
        const dirtySingleCustomDelimeter = inputStateVal.match(anySingleCustomDelimeterRegex);
        const cleanSingleCustomDelimeter = dirtySingleCustomDelimeter && dirtySingleCustomDelimeter.pop().replace(/[\/\[]/g, "");

        const singleDelimeter = cleanSingleCustomDelimeter === null ? cleanSingleCustomDelimeter : new RegExp(`[${cleanSingleCustomDelimeter}]`, 'g');
        const anyLengthDelimeter = cleanAnyLengthCustomDelimeter === null ? cleanAnyLengthCustomDelimeter: new RegExp(`[${cleanAnyLengthCustomDelimeter}]`, "g");

        return [singleDelimeter, anyLengthDelimeter];
        
    }
    const cleanInput = () => {
        const newLineRegex = /\\n/g;
        const newLineIndex = inputStateVal.search(newLineRegex);
        return inputStateVal.substring(newLineIndex+2, inputStateVal.length);

    }
    const replaceCustomDelimeter = () => {
        const [singleCustomDelimeter, anyLengthCustomDelimeter] = returnCustomDelimeters();
        let cleanedInput;
        if(singleCustomDelimeter || anyLengthCustomDelimeter) {
            cleanedInput = cleanInput();
        } else {
            cleanedInput = inputStateVal;
        }
        const newLineRegex = /\\n/g;
        const newSansSingleCustomDelimeterInput = cleanedInput.replace(singleCustomDelimeter, ",");
        const newSansAnyLengthCustomDelimeterInput = newSansSingleCustomDelimeterInput.replace(anyLengthCustomDelimeter, ",");
        const newCommaOnlyInput = newSansAnyLengthCustomDelimeterInput.replace(newLineRegex,",");

        return newCommaOnlyInput;
    }

    const mapAllowedNumbers = (str) => {
        const number = parseInt(str,10);
        return number > 1000 ? 0 : number;
    }

    const createNumArray = () => {
        const modifiedInput = replaceCustomDelimeter();
        const inputArr = modifiedInput.split(',');
        const zeroArray = inputArr.filter(n => isNaN(n) || n === "" ).map(v => 0);
        const numberOnlyArray = inputArr.filter(n => !(n === "") && !isNaN(n) ).map(mapAllowedNumbers);
        const negativeNumberArray = numberOnlyArray.filter(n => n < 0);
        if(negativeNumberArray.length) {
            setException(`These negative numbers were found: ${negativeNumberArray.join(',')}. Please use only positive numbers.`)
            return;
        }
        const positiveNumberArray = numberOnlyArray.filter(n => n  > 0)
        setInputNumArray([...positiveNumberArray, ...zeroArray]);
    }

    const evaluateSum = () => {
        const reduceResult = inputNumArray.length && inputNumArray.reduce((acc, currentVal) => acc + currentVal);
        setResult(reduceResult);
    }

    const styleResult = () => {
        return <span id={"resultElement"} className={classes.Result}>{result}</span>;
    }

    return(
        <React.Fragment>
            <div className={classes.CalculatorUIContainer}>
                <input 
                    className={exception.length ? classes.CalculatorInputException : classes.CalculatorInput}
                    type="text"
                    value={inputStateVal} 
                    onChange={(e) => setInputStateVal(e.target.value)} 
                    onBlur={createNumArray}
                    id={"inputVals"}
                    placeholder={placeHolderText ? placeHolderText : "Input comma separated numbers"} />
                <Button id={"calculateButton"} type={"button"} btnType={"Success"} clicked={evaluateSum} >Calculate</Button>
            </div>

            {result !== null && !exception.length ? 
                <div id={"resultDiv"} className={classes.ResultAnnouncement}>The sum of the values is: {styleResult()}</div>
                :
                null
            }
            {exception.length ? 
                <div id={"exceptionElement"} className={classes.Exception}>{exception}</div>
                :
                null
            }
        </React.Fragment>
    )
}

export default stringCalculator;