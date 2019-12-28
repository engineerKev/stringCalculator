import React, { useState } from 'react';

import Button from '../../components/UI/Button/Button';

import classes from './StringCalculator.module.css';

const stringCalculator = (props) => {
    const [inputStateVal, setInputStateVal] = useState("");
    const [inputNumArray, setInputNumArray] = useState([0]);
    const [exception, setException] = useState("")
    const [result, setResult ] = useState(null);
    const { placeHolderText } = props;

    const replaceCustomDelimeter = () => {
        const regex = /\\n/g;
        const newCommaOnlyInput = inputStateVal.replace(regex,",");
        return newCommaOnlyInput;
    }

    const createNumArray = () => {
        const modifiedInput = replaceCustomDelimeter();
        const inputArr = modifiedInput.split(',');
        const zeroArray = inputArr.filter(n => isNaN(n) || n === "").map(v => 0);
        const numberOnlyArray = inputArr.filter(n => !(n === "") && !isNaN(n) ).map(v => parseInt(v, 10));
        // To use in Exeption Handling in Step 4
        // if(numberOnlyArray.length > MAX_VALUES) {
        //     setException("Only two numbers allowed, please reduce your input.")
        //     return;
        // }
        setInputNumArray([...numberOnlyArray, ...zeroArray]);
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