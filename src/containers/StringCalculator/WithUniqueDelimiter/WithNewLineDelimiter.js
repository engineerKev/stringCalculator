import React from 'react';

import StringCalculator from '../../StringCalculator/StringCalculator'

const withNewLineDelimeter = (props) => {
    const placeHolderText = "Input comma or \\n separated numbers"
    return (
        //idea add function here to extra delimeter to then pass to 
        //string calculator
        <StringCalculator placeHolderText={placeHolderText}/>
    )
}

export default withNewLineDelimeter;