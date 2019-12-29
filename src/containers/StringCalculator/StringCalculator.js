import React, { useState } from 'react';

import Button from '../../components/UI/Button/Button';

import classes from './StringCalculator.module.css';

const stringCalculator = (props) => {
    const [inputStateVal, setInputStateVal] = useState("");
    const [inputNumArray, setInputNumArray] = useState([0]);
    const [exception, setException] = useState("")
    const [result, setResult ] = useState(null);
    const { placeHolderText } = props;

    const returnCustomDelimeter = ()  => {
        const anyCustomDelimeterRegex = /(\/{2}[^\d])/g;
        const dirtyCustomDelimeter = inputStateVal.match(anyCustomDelimeterRegex);
        const cleanCustomDelimeter = dirtyCustomDelimeter && dirtyCustomDelimeter.pop().replace("//", "");
        return cleanCustomDelimeter;
        
    }
    const cleanInput = () => {
        const newLineRegex = /\\n/g;
        const newLineIndex = inputStateVal.search(newLineRegex);
        // if(newLineIndex < 0) {
        //     return inputStateVal;
        // }
        return inputStateVal.substring(newLineIndex+2, inputStateVal.length);

    }
    const replaceCustomDelimeter = () => {
        const customDelimter = returnCustomDelimeter();
        let cleanedInput;
        if(customDelimter) {
            cleanedInput = cleanInput();
        } else {
            cleanedInput = inputStateVal;
        }
        const newLineRegex = /\\n/g;
        const newSansCustomDelimeterInput = cleanedInput.replace(customDelimter, ",");
        const newCommaOnlyInput = newSansCustomDelimeterInput.replace(newLineRegex,",");
        return newCommaOnlyInput;
    }

    const mapAllowedNumbers = (str) => {
        const number = parseInt(str,10)
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
                <div className={classes.ResultAnnouncement}>The sum of the values is: {styleResult()}</div>
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