import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
    },
});

class Step1 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Typography component="p">
                    Some introductions
                </Typography>
            </div>
        );
    }
}

Step1.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Step1);