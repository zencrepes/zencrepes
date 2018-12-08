import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import RefreshAll from './RefreshAll.js';
import RefreshSelected from './RefreshSelected.js';
import RefreshMilestones from './RefreshMilestones.js';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
    toolbarButtons: {
        flex: 1,
    },
});


class Actions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {
            classes,
            setLoadFlag,
            setLoadRepos,
            facets
        } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <div className={classes.toolbarButtons}>
                            <RefreshAll
                                setLoadFlag={setLoadFlag}
                                setLoadRepos={setLoadRepos}
                            />
                            <RefreshSelected
                                setLoadFlag={setLoadFlag}
                                setLoadRepos={setLoadRepos}
                                facets={facets}
                            />
                            <RefreshMilestones />
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    facets: state.milestonesView.facets,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesFetch.setLoadFlag,
    setLoadRepos: dispatch.milestonesFetch.setLoadRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));
