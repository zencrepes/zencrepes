import React from 'react';
import ReactDOM from 'react-dom';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './FacetSelector.css';

class FacetSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: {},
        };
    };

    onChangeComplete = () => {
        const { value } = this.state;
        console.log('handleSlider');
        console.log(value);
    }

    getMax = (data) => {
        if (data.length > 0)
            return Math.max.apply(Math, data.map(x =>  Number.parseInt(x.name) || 1 ));
        else
            return 1;
    };

    getMin = (data) => {
        if (data.length > 0)
            return Math.min.apply(Math, data.map(x =>  Number.parseInt(x.name) || 0 ));
        else
            return 0;
    };

    render() {
        const { data } = this.props;
        const { value } = this.state;

        let selectedValue = {};
        if (Object.keys(value).length !== 0) {
            selectedValue = value;
        } else {
            selectedValue = {min: this.getMin(data),max: this.getMax(data)};
        }

        return (
            <div className="input-range-wrapper">
                <InputRange
                    maxValue={this.getMax(data)}
                    minValue={this.getMin(data)}
                    formatLabel={value => `${value} days`}
                    value={selectedValue}
                    onChange={value => this.setState({ value })}
                    onChangeComplete={this.onChangeComplete}
                />

            </div>
        );
    }
}
//onChange={value => this.setState({ value })} />
//                    onChange={this.handleSlider(value)} />

export default FacetSelector;