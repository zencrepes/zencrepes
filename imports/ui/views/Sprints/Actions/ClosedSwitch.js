import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Switch from '@material-ui/core/Switch';
import {connect} from "react-redux";

const styles = {
    root: {
        textAlign: 'right'
    },
};
class ClosedSwitch extends Component {
    constructor (props) {
        super(props);
    }

    handleChange = (event) => {
        const { updateShowClosed } = this.props;
        updateShowClosed(event.target.checked);
    };

    render() {
        const { classes, showClosed } = this.props;

        return (
            <div className={classes.root}>
                Show closed milestones - No
                <Switch
                    checked={showClosed}
                    onChange={this.handleChange}
                    value="defaultPoints"
                />
                Yes
            </div>
        )
    }
}

ClosedSwitch.propTypes = {
    classes: PropTypes.object.isRequired,
    showClosed: PropTypes.bool.isRequired,
    updateShowClosed: PropTypes.func.isRequired,
};

const mapState = state => ({
    showClosed: state.sprintsView.showClosed,
});

const mapDispatch = dispatch => ({
    updateShowClosed: dispatch.sprintsView.updateShowClosed,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ClosedSwitch));