import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

class Refresh extends Component {
    constructor (props) {
        super(props);
    }

    loadLabels = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        return (
            <Button variant="contained" color="primary" onClick={this.loadLabels}>
                Load/Refresh Labels
            </Button>
        );
    }
}

Refresh.propTypes = {
    setLoadFlag: PropTypes.func.isRequired,
};

export default Refresh;
