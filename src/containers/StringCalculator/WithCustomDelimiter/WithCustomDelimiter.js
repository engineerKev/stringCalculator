import React from 'react';

import StringCalculator from '../../StringCalculator/StringCalculator'

const withCustomDelimeter = (props) => {
    const placeHolderText = "Input comma or \\n separated numbers"
    return (
        <StringCalculator placeHolderText={placeHolderText}/>
    )
}

export default withCustomDelimeter;