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
        const { data } = this.props;
        console.log('onChangeComplete');
        if (data.length > 0) {
            //Check if max and min values are in the data array, if not in the array, return a default value with a count of 0
            let minValue = {count: 0, name: value.min, group: data[0].group, nested: data[0].nested};
            let minIdx = data.map((v) => {return Number.parseInt(v.name)}).indexOf(value.min);
            if (minIdx !== -1) { minValue = data[minIdx];}

            let maxValue = {count: 0, name: value.max, group: data[0].group, nested: data[0].nested};
            let maxIdx = data.map((v) => {return Number.parseInt(v.name)}).indexOf(value.max);
            if (maxIdx !== -1) { maxValue = data[maxIdx];}

            console.log('onChangeComplete - Min: ' + JSON.stringify(minValue));
            console.log('onChangeComplete - Max: ' + JSON.stringify(maxValue));
        }
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