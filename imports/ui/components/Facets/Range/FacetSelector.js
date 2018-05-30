import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

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

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        console.log('componentDidUpdate');
        const { queryValues, data, removeFilter } = this.props;

        // This allows the input range to go back to its initial min/max values after the filter has been cleared
        if (data[0] !== undefined) {
            let facetGroup = data[0].group;
            if (prevProps.queryValues[facetGroup]!== undefined && prevProps.queryValues[facetGroup].length > 0 && queryValues[facetGroup].length === 0){
                this.setState({value: {min: this.getMin(data),max: this.getMax(data)}});
            }

            //TODO -
            console.log('---');
            console.log(prevState.value);
            console.log(this.state.value);
            console.log(prevProps.queryValues[facetGroup]);
            console.log(queryValues[facetGroup]);
            console.log('---');

            // Remove a previously applied filter.
            //if (prevProps.queryValues[facetGroup] !== undefined && prevProps.queryValues[facetGroup][0] !== undefined ) {
            //    removeFilter(prevProps.queryValues[facetGroup][0]);
            //}
        }



    };

    onChangeComplete = () => {
        const { value } = this.state;
        const { data, addFilterRefresh, removeFilterRefresh, queryValues } = this.props;

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

            // Merge min & max'
            let rangeValue = {count: 0, name: 'Range: ' + data[0].group, group: data[0].group, nested: data[0].nested, type: data[0].type, min: parseInt(minValue.name), max: parseInt(maxValue.name)};
            console.log(rangeValue);
            //replaceFilterRefresh(rangeValue);

            //check to handle the situation where the group does not exist yet
            let valueChecked = [];
            if (queryValues[value.group] !== undefined) {
                valueChecked = queryValues[value.group];
            }

            //Check if the value is already in the state, if yes remove, if not add.
            const currentIndex = valueChecked.map((v) => {return v.name}).indexOf(rangeValue.name);
            if (currentIndex === -1) {
                addFilterRefresh(rangeValue);
            } else {
                removeFilterRefresh(rangeValue);
            }
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

    getValue = (data, value) => {
        let selectedValue = {};

        if (Object.keys(value).length !== 0) {
            selectedValue = value;
            if (value.min < this.getMin(data)) {selectedValue.min = this.getMin(data);}
            if (value.max > this.getMax(data)) {selectedValue.max = this.getMin(data);}
        } else {
            selectedValue = {min: this.getMin(data),max: this.getMax(data)};
        }
        return selectedValue;
    };

    render() {
        const { data, queryValues } = this.props;
        const { value } = this.state;

        let selectedValue = this.getValue(data, value);
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

const mapDispatch = dispatch => ({
    addFilterRefresh: dispatch.data.addFilterRefresh,
    removeFilterRefresh: dispatch.data.removeFilterRefresh,
    removeFilter: dispatch.data.removeFilter,
});

const mapState = state => ({
    queryValues: state.data.filters,
});

export default connect(mapState, mapDispatch)(FacetSelector);