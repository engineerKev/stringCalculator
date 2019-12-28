import React from 'react';
import { shallow, mount} from 'enzyme';
import App from './App';
import StringCalculator from  './containers/StringCalculator/StringCalculator';
import Button from './components/UI/Button/Button';

describe("App renders successfully", () => {
    it('renders without crashing', () => {
        shallow(<App />);
    });
});

describe("StringCalculator renders successfully", () => {
    it('renders without crashing', () => {
        const wrapper = mount(<StringCalculator />);
        expect(wrapper.find("input")).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});

describe("Inputing values", () => {
    it('values are entered into the input field and state updates', () => {
        const wrapper = shallow(<StringCalculator />);
        
        wrapper.find("input").simulate('change', { target: { value: '1,2' } });

        wrapper.find(Button).simulate("click");

        expect(wrapper.find('#resultElement')).toHaveLength(1);
    });
});

