import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import App from '../src/App';
import StringCalculator from  '../src/containers/StringCalculator/StringCalculator';
import WithCustomDelimeter from '../src/containers/StringCalculator/WithCustomDelimiter/WithCustomDelimiter';
import Button from '../src/components/UI/Button/Button';

describe("App renders successfully", () => {
    it('renders without crashing', () => {
        shallow(<App />);
    });
});

describe("StringCalculator renders successfully", () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<StringCalculator />);
        expect(wrapper.find("input")).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});

describe("Inputing negative numbers with non custom delimeters", () => {
    
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
        
        wrapper.find("input").simulate('change', { target: { value: negatives } });

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
        
        wrapper.find("input").simulate('change', { target: { value: negativesInput } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#exceptionElement').exists()).toEqual(true)
        
        expect(wrapper.find('#exceptionElement').text()).toEqual(exceptionString)
    })
});

describe("Inputing values with non-custom delimeters", () => {

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
        
        wrapper.find("input").simulate('change', { target: { value: '1,2' } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('3')

    });
    
    it('\\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        wrapper.find("input").simulate('change', { target: { value: '1\\n2' } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('3')

    });
    
    it('Comma and \\n separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        wrapper.find("input").simulate('change', { target: { value: '1\\n2,3\\n4' } });

        wrapper.find("#inputVals").props().onBlur();

        wrapper.find(Button).props().clicked();

        expect(wrapper.find('#resultDiv').exists()).toEqual(true)
        
        expect(wrapper.find('#resultElement').text()).toEqual('10')

    });
});

describe("Inputing values with custom delimeters", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        const placeHolderText = "Input comma, \\n or //{delimiter}\\n{numbers} separated numbers"
        wrapper = mount(<WithCustomDelimeter placeHolderText={placeHolderText} />)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one characters separated values are entered into the input field, button is clicked, and result is shown', () => {
        
        act(() => {
            wrapper.find("input").simulate('change', { target: { value: '//*\\n1*2' } });
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
            wrapper.find("input").simulate('change', { target: { value: '//[&&&]\\n1&&&2' } });
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
            wrapper.find("input").simulate('change', { target: { value: '//@\\n1\\n2,3@4' } });
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
            wrapper.find("input").simulate('change', { target: { value: '//[@@@]\\n1\\n2,3@@@4' } });
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

describe("Inputing negative values with custom delimeters", () => {

    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        const placeHolderText = "Input comma, \\n or //{delimiter}\\n{numbers} separated numbers"
        wrapper = mount(<WithCustomDelimeter placeHolderText={placeHolderText} />)
    
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Custom one characters separated negative values are entered into the input field, button is clicked, and exception is shown', () => {

        const negativesResult = '-3,-5';

        const exceptionString = `These negative numbers were found: ${negativesResult}. Please use only positive numbers.`;
        
        act(() => {
            wrapper.find("input").simulate('change', { target: { value: '//*\\n1*2,-3\\n-5' } });
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
            wrapper.find("input").simulate('change', { target: { value: '//[&&&]\\n1&&&2\\n-8,-9' } });
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
            wrapper.find("input").simulate('change', { target: { value: '//@\\n1\\n2,3@4@-1,-7' } });
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
            wrapper.find("input").simulate('change', { target: { value: '//[@@@]\\n1\\n2,3@@@4,-6\\n-2' } });
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
