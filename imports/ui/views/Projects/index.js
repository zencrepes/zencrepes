import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import ProjectsFetch from '../../data/Projects/Fetch/index.js';

import ProjectsFacets from './Facets/index.js';
import ProjectsQuery from './Query/index.js';
import Actions from './Actions/index.js';
import NoData from "./NoData/index.js";
import ProjectsTable from "./ProjectsTable/index.js";

const style = {
    root: {
        marginRight: '10px'
    },
    fullWidth :{
        width: '100%',
    }
};

class Projects extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        if (params.get('q') !== null) {
            const queryUrl = decodeURIComponent(params.get('q'));
            updateQuery(JSON.parse(queryUrl));
        } else {
            updateQuery({'state':{'$in':['OPEN']}});
        }
    }

    componentDidUpdate(prevProps) {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = decodeURIComponent(params.get('q'));

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = decodeURIComponent(oldParams.get('q'));

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
    }

    render() {
        const { classes, projects } = this.props;

        return (
            <General>
                <Actions />
                <ProjectsFetch loadModal={false} />
                {projects.length === 0 ? (
                    <NoData />
                ) : (
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item >
                            <ProjectsFacets />
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} sm className={classes.fullWidth}>
                                    <ProjectsQuery />
                                </Grid>
                                <Grid item xs={12} sm className={classes.fullWidth}>
                                    <ProjectsTable
                                        projects={projects}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </General>
        );
    }
}

Projects.propTypes = {
    classes: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    updateQuery: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.projectsView.updateQuery,
});

const mapState = state => ({
    projects: state.projectsView.projects,
});


export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(Projects)));
