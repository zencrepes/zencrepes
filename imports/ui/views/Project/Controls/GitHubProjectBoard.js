import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';

import ProjectLink from '../../../components/Links/ProjectLink/index.js';

const styles = {
    root: {
        textAlign: 'right'
    },
};
class GitHubProjectBoard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, projects } = this.props;
        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={12} sm container>
                        <span>GitHub Project Board:</span>
                </Grid>
                <Grid item>
                    <div className={classes.root}>
                        {projects.map(project => (
                            <ProjectLink key={project.id} project={project} />
                        ))}
                        {projects.length === 0 &&
                            <span>No project found</span>
                        }
                    </div>
                </Grid>
            </Grid>
        );
    }
}

GitHubProjectBoard.propTypes = {
    classes: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
};

const mapState = state => ({
    projects: state.projectView.projects,
});

export default connect(mapState, null)(withStyles(styles)(GitHubProjectBoard));