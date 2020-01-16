import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import App from '../src/App';
import StringCalculator from  '../src/containers/StringCalculator/StringCalculator';
import WithCustomDelimiter from '../src/containers/StringCalculator/WithCustomDelimiter/WithCustomDelimiter';
import Button from '../src/components/UI/Button/Button';

describe("App renders successfully", () => {
    it('renders without crashing', () => {
        shallow(<App />);
    });
});

describe("StringCalculator renders successfully", () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<StringCalculator />);
        expect(wrapper.find("input")).toHaveLength(5);
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});

describe("Inputing negative numbers with non custom delimiters", () => {
    
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Issues an ui exception notifiying the use of the negative numbers entered, comma separated", () => {
        const wrapper = shallow(<StringCalculator />);

        const negatives = '-1,-2';

        const exceptionString = `These negative numbers were found: ${negatives}. Please use only positive numbers.`;
        
        wrapper.find("#inputVals").simulate('change', { target: { value: negatives } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#exceptionElement').exists()).toEqual(true)
        
        expect(wrapper.find('#exceptionElement').text()).toEqual(exceptionString)
    });

    it("Issues an ui exception notifiying the use of the negative numbers entered, \\n separated", () => {
        const wrapper = shallow(<StringCalculator />);

        const negativesInput = '-3\\n-5';

        const negativesResult = '-3,-5';

        const exceptionString = `These negative numbers were found: ${negativesResult}. Please use only positive numbers.`;
        
        wrapper.find("#inputVals").simulate('change', { target: { value: negativesInput } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#exceptionElement').exists()).toEqual(true)
        
        expect(wrapper.find('#exceptionElement').text()).toEqual(exceptionString)
    })
});

describe("Inputing values with non-custom delimiters", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = shallow(<StringCalculator />)
    
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Comma separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        wrapper.find("#inputVals").simulate('change', { target: { value: '1,2' } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('3')

    });
    
    it('\\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        wrapper.find("#inputVals").simulate('change', { target: { value: '1\\n2' } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('3')

    });
    
    it('Comma and \\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        wrapper.find("#inputVals").simulate('change', { target: { value: '1\\n2,3\\n4' } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('10')

    });
});

describe("Inputing values with custom delimiters", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter allowNegatives={false} removeUpperBound={false} alternateDelimiter={false} />)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one characters separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//*\\n1*2' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('3')

    });
    
    it('Custom n character separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//[&&&]\\n1&&&2' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('3')

    });
    
    it('Custom one character, comma and \\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//@\\n1\\n2,3@4' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('10')

    });

    it('Custom n character, comma and \\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//[@@@]\\n1\\n2,3@@@4' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
        wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('10')

    });
});

describe("Inputing negative values with custom delimiters", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter allowNegatives={false} removeUpperBound={false} alternateDelimiter={false} />)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one characters separated negative values are entered into the input field, button is clicked, and exception is shown', () => {

        const negativesResult = '-3,-5';

        const exceptionString = `These negative numbers were found: ${negativesResult}. Please use only positive numbers.`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//*\\n1*2,-3\\n-5' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#exceptionElement').exists()).toEqual(true);
        
        expect(wrapper.find('#exceptionElement').text()).toEqual(exceptionString);

    });
    
    it('Custom n character separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        const negativesResult = '-8,-9';

        const exceptionString = `These negative numbers were found: ${negativesResult}. Please use only positive numbers.`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//[&&&]\\n1&&&2\\n-8,-9' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#exceptionElement').exists()).toEqual(true);
        
        expect(wrapper.find('#exceptionElement').text()).toEqual(exceptionString);

    });
    
    it('Custom one character, comma and \\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        const negativesResult = '-1,-7';

        const exceptionString = `These negative numbers were found: ${negativesResult}. Please use only positive numbers.`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//@\\n1\\n2,3@4@-1,-7' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#exceptionElement').exists()).toEqual(true);
        
        expect(wrapper.find('#exceptionElement').text()).toEqual(exceptionString);

    });

    it('Custom n character, comma and \\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        const negativesResult = '-6,-2';

        const exceptionString = `These negative numbers were found: ${negativesResult}. Please use only positive numbers.`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: '//[@@@]\\n1\\n2,3@@@4,-6\\n-2' } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
        wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#exceptionElement').exists()).toEqual(true);
        
        expect(wrapper.find('#exceptionElement').text()).toEqual(exceptionString);

    });
});

describe("Formula is shown of how result was arrived at by calculator", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter allowNegatives={false} removeUpperBound={false} alternateDelimiter={false} />)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//&\\n4,5&1&10&^,#';

        const formula = '4+5+1+10+0+0';

        const result = '20';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    
    it('Custom n character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {
        
        const input = '//[&&&&]\\n4,5&&&&1&&&&10&&&&^';

        const formula = '4+5+1+10+0';

        const result = '20';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
    
    it('Custom one character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//&\\n4,5&1&10&^,#,1';

        const formula = '4+5+1+10+0+0+1';

        const result = '21';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });

    it('Custom multiple n character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//[&&][!!!]\\n4,5&&1&&10&&^,#,1!!!9!!!5';

        const formula = '4+5+1+10+0+0+1+9+5';

        const result = '35';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
});

describe("String calculator has upper limit of 1000 removed", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter removeUpperBound={true} allowNegatives={false} alternateDelimiter={false} />)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//&\\n4,5&1&10&^,#,1000';

        const formula = '4+5+1+10+0+0+1000';

        const result = '1020';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    
    it('Custom n character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {
        
        const input = '//[&&&&]\\n4,5&&&&1&&&&10&&&&^,10001';

        const formula = '4+5+1+10+0+10001';

        const result = '10021';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
    
    it('Custom one character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//&\\n4,5&1&10&^,#,1&1500';

        const formula = '4+5+1+10+0+0+1+1500';

        const result = '1521';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });

    it('Custom multiple n character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//[&&][!!!]\\n4,5&&1&&10&&^,#,1!!!9!!!5&&1100';

        const formula = '4+5+1+10+0+0+1+9+5+1100';

        const result = '1135';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
});
describe("String calculator allows negative numbers", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter removeUpperBound={false} alternateDelimiter={false}  allowNegatives={true}/>)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//&\\n4,5&1&10&^,#,-1';

        const formula = '4+5+1+10+0+0+-1';

        const result = '19';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    
    it('Custom n character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {
        
        const input = '//[&&&&]\\n4,5&&&&1&&&&10&&&&^,-2';

        const formula = '4+5+1+10+0+-2';

        const result = '18';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
    
    it('Custom one character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//&\\n4,5&1&10&^,#,1&-1';

        const formula = '4+5+1+10+0+0+1+-1';

        const result = '20';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });

    it('Custom multiple n character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//[&&][!!!]\\n4,5&&1&&10&&^,#,1!!!9!!!5&&-5';

        const formula = '4+5+1+10+0+0+1+9+5+-5';

        const result = '30';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
});

describe("User provides alternate delimeter", () => {

    let wrapper;
    let alternateDelimiterInput;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter allowNegatives={false} removeUpperBound={false} alternateDelimiter={true} />)
        alternateDelimiterInput = wrapper.find('#alternateDelimiterInput');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Shows new custom delimiter in placeholder of input of string calculator', () => {
        expect(alternateDelimiterInput.exists()).toEqual(true);

        act(() => {
            alternateDelimiterInput.simulate('change', { target: { value: "$" } });
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        })
        wrapper.update();
        expect(wrapper.find('#inputVals').exists()).toEqual(true);
        expect(wrapper.find('#inputVals').props().placeholder).toEqual('Input comma, \\$ or //[delimiter]\\n{numbers} separated numbers');
    });

});

describe("String calculator works as expected with custom alternate delimiter ie replacement delimiter for \\n", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        const placeHolderText = "Input comma, \\@ or //[delimiter]\\n{numbers} separated numbers"
        wrapper = mount(<StringCalculator 
            placeHolderText={placeHolderText} 
            alternateDelimiter={"@"}
            allowNegatives={false}
            removeUpperBound={false}
        />)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//!\\n1!1\\@2';

        const formula = '1+1+2';

        const result = '4';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    
    it('Custom n character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {
        
        const input = '//[&&&&]\\n4,5&&&&1&&&&10&&&&^\\@2';

        const formula = '4+5+1+10+0+2';

        const result = '22';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
    
    it('Custom one character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//&\\n4,5&1&10\\@10';

        const formula = '4+5+1+10+10';

        const result = '30';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });

    it('Custom multiple n character, comma and \\n separated values are entered into the input field, result is shown along with formula used to derive result.', () => {
        
        const input = '//[&&][!!!]\\n4,5&&1&&10&&^,#,1!!!9!!!5&&5\\@5';

        const formula = '4+5+1+10+0+0+1+9+5+5+5';

        const result = '45';

        const formulaString = `Formula used: ${formula}`;
        
        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)

    });
});
describe("String calculator works when multiplication is selected", () => {

    let wrapper;
    let operatorInput;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter removeUpperBound={false} alternateDelimiter={false}  allowNegatives={false}/>)
        operatorInput = wrapper.find("#multiplicationRadioBtn");
        act(() => {
            operatorInput.simulate("change", { target: { value: 'multiplication' } });
        });
        wrapper.update();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//!\\n1!1!2';

        const formula = '1*1*2';

        const result = '2';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    it('Default delimeters are used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '1,1\\n2';

        const formula = '1*1*2';

        const result = '2';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    it('Multiple N-length delimeters are used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//[&&][!!!]\\n1,1\\n2&&2!!!3';

        const formula = '1*1*2*2*3';

        const result = '12';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
});
describe("String calculator works when division is selected", () => {

    let wrapper;
    let operatorInput;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter removeUpperBound={false} alternateDelimiter={false}  allowNegatives={false}/>)
        operatorInput = wrapper.find("#divisionRadioBtn");
        act(() => {
            operatorInput.simulate("change", { target: { value: 'substraction' } });
        });
        wrapper.update();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//!\\n1!1!2';

        const formula = '1-1-2';

        const result = '-2';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    it('Default delimeters are used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '1,1\\n2';

        const formula = '1-1-2';

        const result = '-2';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    it('Multiple N-length delimeters are used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//[&&][!!!]\\n1,1\\n2&&2!!!3';

        const formula = '1-1-2-2-3';

        const result = '-7';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
});
describe("String calculator works when division is selected", () => {

    let wrapper;
    let operatorInput;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = mount(<WithCustomDelimiter removeUpperBound={false} alternateDelimiter={false}  allowNegatives={false}/>)
        operatorInput = wrapper.find("#divisionRadioBtn");
        act(() => {
            operatorInput.simulate("change", { target: { value: 'division' } });
        });
        wrapper.update();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one character delimiter is used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//!\\n1!1!2';

        const formula = '1/1/2';

        const result = '0.5';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    it('Default delimeters are used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '1,1\\n2';

        const formula = '1/1/2';

        const result = '0.5';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
    it('Multiple N-length delimeters are used and formula for deriving result is shown with result. Non number inputs are substituted for zeros', () => {

        const input = '//[&&][!!!]\\n1,1\\n2&&2!!!3';

        const formula = '1/1/2/2/3';

        const result = '0.08333333333333333';

        const formulaString = `Formula used: ${formula}`;
        

        act(() => {
            wrapper.find("#inputVals").simulate('change', { target: { value: `${input}` } });
        });
        wrapper.update();

        act(() => {
            wrapper.find("#inputVals").props().onBlur();
        });
        wrapper.update();

        act(() => {
            wrapper.find(Button).props().clicked();
        });
        wrapper.update();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual(result)

        expect(wrapper.find('#formula').exists()).toEqual(true)
        
        expect(wrapper.find('#formula').text()).toEqual(formulaString)
    });
});
