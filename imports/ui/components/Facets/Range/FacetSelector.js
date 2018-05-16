import React from 'react';
import ReactDOM from 'react-dom';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './FacetSelector.css';

class FacetSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: { min: 0, max: 1 },
        };
    }

    getMax = (data) => {
        if (data.length > 0)
            return Math.max.apply(Math, data.map(x =>  Number.parseInt(x.name) || 0 ));
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

        return (
            <div className="input-range-wrapper">
                <InputRange
                    maxValue={this.getMax(data)}
                    minValue={this.getMin(data)}
                    formatLabel={value => `${value} days`}
                    value={value}
                    onChange={value => this.setState({ value })} />
            </div>
        );
    }
}

export default FacetSelector;