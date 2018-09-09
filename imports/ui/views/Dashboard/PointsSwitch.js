import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Switch from '@material-ui/core/Switch';

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class PointsSwitch extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    handleChange = name => event => {
        const { setRemainingDefaultPoints, setVelocityDefaultPoints, setRepartitionDefaultPoints } = this.props;
        setRemainingDefaultPoints(event.target.checked);
        setVelocityDefaultPoints(event.target.checked);
        setRepartitionDefaultPoints(event.target.checked);
    };

    render() {
        const { classes, defaultPoints } = this.props;

        return (
            <div className={classes.root}>
                Issues Count
                <Switch
                    checked={defaultPoints}
                    onChange={this.handleChange('defaultPoints')}
                    value="defaultPoints"
                />
                Points
            </div>
        )
    };
}

PointsSwitch.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setRemainingDefaultPoints: dispatch.remaining.setDefaultPoints,
    setVelocityDefaultPoints: dispatch.velocity.setDefaultPoints,
    setRepartitionDefaultPoints: dispatch.repartition.setDefaultPoints,
});

const mapState = state => ({
    defaultPoints: state.remaining.defaultPoints,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(PointsSwitch));
