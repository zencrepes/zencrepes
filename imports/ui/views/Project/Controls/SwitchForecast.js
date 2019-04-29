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
class SwitchForecast extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { updateVelocityTeam } = this.props;
        updateVelocityTeam(event.target.checked);
    };

    render() {
        const { classes, velocityTeam, projectsIssues } = this.props;

        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={12} sm>
                    <div className={classes.itemTitle}>Velocity and forecast based on:</div>
                </Grid>
                <Grid item>
                    <div className={classes.root}>
                        Assignees
                        <Switch
                            checked={velocityTeam}
                            onChange={this.handleChange}
                            value="velocityTeam"
                            disabled={projectsIssues.length > 0 ? false : true}
                        />
                        Project Team
                    </div>
                </Grid>
            </Grid>

        );
    }
}

SwitchForecast.propTypes = {
    classes: PropTypes.object.isRequired,
    projectsIssues: PropTypes.array.isRequired,
    velocityTeam: PropTypes.bool.isRequired,
    updateVelocityTeam: PropTypes.func.isRequired,
};

const mapState = state => ({
    velocityTeam: state.projectView.velocityTeam,
    projectsIssues: state.projectView.projectsIssues,
});

const mapDispatch = dispatch => ({
    updateVelocityTeam: dispatch.projectView.updateVelocityTeam,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SwitchForecast));