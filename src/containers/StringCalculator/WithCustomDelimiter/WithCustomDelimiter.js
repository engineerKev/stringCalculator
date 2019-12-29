import React from 'react';

import StringCalculator from '../../StringCalculator/StringCalculator'

const withCustomDelimeter = (props) => {
    const placeHolderText = "Input comma, \\n or //{delimiter}\\n{numbers} separated numbers"
    return (
        <StringCalculator placeHolderText={placeHolderText}/>
    )
}

export default withCustomDelimeter;