import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const styles = theme => ({
    root: {
    },
});
class Clear extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, clearQuery } = this.props;
        return (
            <Button variant="raised" color="default" onClick={clearQuery}>
                Clear
            </Button>
        )
    };
}

Clear.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Clear);
