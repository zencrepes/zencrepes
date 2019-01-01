import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import RefreshAll from './RefreshAll.js';
import RefreshSelected from './RefreshSelected.js';
import RefreshMilestones from './RefreshMilestones.js';

const styles = {
    toolbarButtons: {
        flex: 1,
    },
};

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
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object.isRequired,
    facets: PropTypes.array.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoadRepos: PropTypes.func.isRequired,
};

const mapState = state => ({
    facets: state.milestonesView.facets,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesFetch.setLoadFlag,
    setLoadRepos: dispatch.milestonesFetch.setLoadRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));
