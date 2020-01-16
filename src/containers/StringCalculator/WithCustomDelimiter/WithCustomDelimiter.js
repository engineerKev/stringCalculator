import React, { useState } from 'react';

import StringCalculator from '../../StringCalculator/StringCalculator';
import Button from '../../../components/UI/Button/Button';
import classes from './WithCustomDelimiter.module.css';

const withCustomDelimiter = (props) => {
    const [altDelimiter, setAltDelimiter] = useState("");
    const [showCalculator, setShowCalculator] = useState(false);
    const { 
        allowNegatives,
        removeUpperBound,
        alternateDelimiter
    } = props
    
    const altOrDefaultDelimiter = altDelimiter.length ? `${altDelimiter}` : `n`;

    const placeHolderText = `Input comma, \\${altOrDefaultDelimiter} or //[delimiter]\\n{numbers} separated numbers`;
    
    const updateUI = (altDelimiterInput) => {
        setAltDelimiter(altDelimiterInput);
        setShowCalculator(true);
    }

    const alternateDelimiterUI = () => {
        return (
            <div className={classes.AlternateDelimiterUIContainer}>
                <input
                    placeholder={"Enter new delimiter character or n for default"}
                    type={"text"}
                    value={altDelimiter}
                    onChange={(e) => setAltDelimiter(e.target.value)}
                    onBlur={(e) => setAltDelimiter(e.target.value)}
                    className={classes.DelimeterInput}
                    id={"alternateDelimiterInput"}
                />
                <Button
                    type={"button"}
                    btnType={"Success"}
                    id={"altDelimiterButton"}
                    clicked={() => updateUI(altDelimiter)}
                >Set Alt Delimenter</Button>
            </div>
        );
    };

    const output = () => {
        return (showCalculator || !alternateDelimiter ?
            <StringCalculator
                placeHolderText={placeHolderText}
                alternateDelimiter={altDelimiter}
                allowNegatives={allowNegatives}
                removeUpperBound={removeUpperBound}
            />
            :
            alternateDelimiterUI()
        );
    }

    return output()
}

export default withCustomDelimiter;