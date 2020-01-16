import React, { useState } from 'react';

import Button from '../../components/UI/Button/Button';

import classes from './StringCalculator.module.css';

const stringCalculator = (props) => {
    const [inputStateVal, setInputStateVal] = useState("");
    const [inputNumArray, setInputNumArray] = useState([0]);
    const [exception, setException] = useState("")
    const [result, setResult ] = useState(null);
    const [formula, setFormula] = useState("");
    const [operation, setOperation] = useState("addition");

    const { placeHolderText, removeUpperBound, allowNegatives, alternateDelimiter } = props;

    const createDelimeterObjWithReduce = (accObj, currentVal) => {
        if(accObj.hasOwnProperty(currentVal)) {
            accObj[currentVal] = accObj[currentVal] + 1;
        } else {
            accObj[currentVal] = 1;
        }
        return accObj
    }

    const returnCustomDelimeterNLengthString = (accStr, key, i, objKeys, obj) => {
        accStr += `\\${key}{${obj[key]}}`;
        if (i !== objKeys.length - 1) {
            accStr += "|";
        }
        return accStr;
    }

    const returnCustomDelimeters = ()  => {

        const anyLengthCustomDelimeterRegex = /(\/{2}\[(.*)\])/g;
        const dirtyAnyLengthCustomDelimeter = inputStateVal.match(anyLengthCustomDelimeterRegex);
        const anyLengthCleanUpRegex = /[\[\]\/]/g;
        const cleanAnyLengthCustomDelimeter = dirtyAnyLengthCustomDelimeter && dirtyAnyLengthCustomDelimeter.pop().replace(anyLengthCleanUpRegex, "");
        let multipleCustomDelimeterNLengthString = "";
        
        if(dirtyAnyLengthCustomDelimeter) {
            
            const anyLengthDelimeterArray = cleanAnyLengthCustomDelimeter && cleanAnyLengthCustomDelimeter.split("");
            const multipleLengthDelimeterObj = anyLengthDelimeterArray && anyLengthDelimeterArray.reduce(createDelimeterObjWithReduce, {});
            const multipleDelimeterObjKeys = Object.keys(multipleLengthDelimeterObj);
            multipleCustomDelimeterNLengthString = multipleDelimeterObjKeys.reduce((accStr, key, i) => returnCustomDelimeterNLengthString(accStr, key, i, multipleDelimeterObjKeys, multipleLengthDelimeterObj), "")

        }

        const anySingleCustomDelimeterRegex = /(\/{2}[^\d])/g;
        const dirtySingleCustomDelimeter = inputStateVal.match(anySingleCustomDelimeterRegex);
        const cleanSingleCustomDelimeter = dirtySingleCustomDelimeter && dirtySingleCustomDelimeter.pop().replace(/[\/\[]/g, "");

        const singleDelimeter = cleanSingleCustomDelimeter === null ? cleanSingleCustomDelimeter : new RegExp(`[${cleanSingleCustomDelimeter}]`, 'g');
        const anyLengthDelimeter = cleanAnyLengthCustomDelimeter === null ? cleanAnyLengthCustomDelimeter : new RegExp(`(${multipleCustomDelimeterNLengthString})`, "g");
        
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
        let altDelimiterRegex;
        let newCommaOnlyInput;
        if(singleCustomDelimeter || anyLengthCustomDelimeter) {
            cleanedInput = cleanInput();
        } else {
            cleanedInput = inputStateVal;
        }
        const newLineRegex = /\\n/g;
        const newSansSingleCustomDelimeterInput = cleanedInput.replace(singleCustomDelimeter, ",");
        const newSansAnyLengthCustomDelimeterInput = newSansSingleCustomDelimeterInput.replace(anyLengthCustomDelimeter, ",");
        if(alternateDelimiter) {
            altDelimiterRegex = new RegExp(`\\\\${alternateDelimiter}`, 'g')
            newCommaOnlyInput = newSansAnyLengthCustomDelimeterInput.replace(altDelimiterRegex,",");
        } else {
            newCommaOnlyInput =  newSansAnyLengthCustomDelimeterInput.replace(newLineRegex,",")
        }
        return newCommaOnlyInput;
    }

    const mapAllowedNumbers = (str) => {
        const num = parseInt(str, 10);
        if(isNaN(num)) {
            return 0;
        } else {
            if(removeUpperBound) {
                return num;
            }
            return num > 1000 ? 0 : num;
        }
    }
    const composeFormula = (numArr) => {
       switch  (operation) {
           case 'division':
               return numArr.join("/");
            case 'multiplication':
                return numArr.join("*");
            case 'substraction':
                return numArr.join("-");
            default:
                return numArr.join("+");
       } 
    }

    const createNumArray = () => {
        const modifiedInput = replaceCustomDelimeter();
        const inputArr = modifiedInput.split(',');
        const numOnlyArray = inputArr.map(mapAllowedNumbers);
        const negativeNumberArray = numOnlyArray.filter(n => n < 0);
        if(negativeNumberArray.length && !allowNegatives) {
            setException(`These negative numbers were found: ${negativeNumberArray.join(',')}. Please use only positive numbers.`)
            return;
        }
        const positiveNumberArray = numOnlyArray.filter(n => n  >= 0);

        if(allowNegatives){
            setInputNumArray([...numOnlyArray]);
        } else {
            setInputNumArray([...positiveNumberArray]);
        }
    }

    const operateOnNumArray = (acc, current, i) => {
       switch  (operation) {
           case 'division':
               return acc * (1/current);
            case 'multiplication':
                return acc * current;
            case 'substraction':
                return i === 0 ? current : acc - current;
            default:
                return acc + current;
       } 
    }
    
    const returnStartingValue = () => {
       switch  (operation) {
           case 'division':
               return 1;
            case 'multiplication':
                return 1;
            case 'substraction':
                return 0;
            default:
                return 0;
       } 
    }

    const evaluateInput = () => {
        setFormula(composeFormula(inputNumArray));
        const reduceResult = inputNumArray.length && inputNumArray.reduce(operateOnNumArray, returnStartingValue());
        setResult(reduceResult);
    }

    const styleResult = () => {
        return <span id={"resultElement"} className={classes.Result}>{result}</span>;
    }


    return(
        <React.Fragment>
            <div className={classes.RadioButtonsContainer}>
                <div className={classes.OperationsInstructions} >Please select from below the operation you want the caltulator to perform</div>
                <label className={classes.LabelText}>
                    <input 
                        type="radio" 
                        value="addition" 
                        checked={operation === "addition"}
                        onChange={(e) => setOperation(e.target.value)}
                        id={"additionRadioBtn"} 
                    />
                    Addition
                </label>
                <label className={classes.LabelText}>
                    <input 
                        type="radio" 
                        value="multiplication" 
                        checked={operation === "multiplication"}
                        onChange={(e) => setOperation(e.target.value)} 
                        id={"multiplicationRadioBtn"} 
                    />
                    Multiplication
                </label>
                <label className={classes.LabelText}>
                    <input 
                        type="radio" 
                        value="substraction" 
                        checked={operation === "substraction"}
                        onChange={(e) => setOperation(e.target.value)} 
                        id={"substractionRadioBtn"} 
                    />
                    Substraction
                </label>
                <label className={classes.LabelText}>
                    <input 
                        type="radio" 
                        value="division" 
                        checked={operation === "division"}
                        onChange={(e) => setOperation(e.target.value)} 
                        id={"divisionRadioBtn"} 
                    />
                    Division
                </label>
            </div>
            <div className={classes.CalculatorUIContainer}>
                <input 
                    className={exception.length ? classes.CalculatorInputException : classes.CalculatorInput}
                    type="text"
                    value={inputStateVal} 
                    onChange={(e) => setInputStateVal(e.target.value)} 
                    onBlur={createNumArray}
                    id={"inputVals"}
                    placeholder={placeHolderText ? placeHolderText : "Input comma separated numbers"} />
                <Button id={"calculateButton"} type={"button"} btnType={"Success"} clicked={evaluateInput} >Calculate</Button>
            </div>

            {result !== null && !exception.length ?
                <React.Fragment>
                    <div id={"resultDiv"} className={classes.ResultAnnouncement}>The sum of the values is: {styleResult()}</div>
                    <div id={"formula"} className={classes.Formula}>Formula used: {`${formula}`}</div>
                </React.Fragment>
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