import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
    },
});

class Step1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
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

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Step1));