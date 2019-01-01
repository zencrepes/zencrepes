import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Switch from '@material-ui/core/Switch';

const styles = {
    root: {
        textAlign: 'right'
    },
};
class PointsSwitch extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    handleChange = (event) => {
        const { setDefaultPoints } = this.props;
        setDefaultPoints(event.target.checked);
    };

    render() {
        const { classes, defaultPoints } = this.props;

        return (
            <div className={classes.root}>
                Issues Count
                <Switch
                    checked={defaultPoints}
                    onChange={this.handleChange}
                    value="defaultPoints"
                />
                Points
            </div>
        )
    }
}

PointsSwitch.propTypes = {
    classes: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    setDefaultPoints: PropTypes.func.isRequired,
};

export default withStyles(styles)(PointsSwitch);
