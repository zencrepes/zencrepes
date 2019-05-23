import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';

const styles = {
    root: {
        textAlign: 'right'
    },
    itemTitle: {
        height: '48px',
        paddingTop: '15px',
    },
};
class SwitchPoints extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { setDefaultPoints } = this.props;
        setDefaultPoints(event.target.checked);
    };

    render() {
        const { classes, defaultPoints } = this.props;

        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={12} sm>
                    <div className={classes.itemTitle}>Calculate metrics using:</div>
                </Grid>
                <Grid item>
                    <div className={classes.root}>
                        Issues Count
                        <Switch
                            checked={defaultPoints}
                            onChange={this.handleChange}
                            value="velocityTeam"
                        />
                        Points
                    </div>
                </Grid>
            </Grid>

        );
    }
}

SwitchPoints.propTypes = {
    classes: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    setDefaultPoints: PropTypes.func.isRequired,
};

const mapState = state => ({
    defaultPoints: state.milestoneView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.milestoneView.setDefaultPoints,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SwitchPoints));