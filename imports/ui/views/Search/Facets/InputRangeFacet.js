import React from 'react';
import ReactDOM from 'react-dom';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './InputRangeFacet.css';

class InputRangeFacet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: { min: 2, max: 10 },
        };
    }
    render() {
        return (
            <div className="input-range-wrapper">
                <InputRange
                    maxValue={20}
                    minValue={0}
                    value={this.state.value}
                    onChange={value => this.setState({ value })} />
            </div>
        );
    }
}

export default InputRangeFacet;