import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import OrgRepoName from './OrgRepoName.js';
import Loading from './Loading.js';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
    },
});

class Repo extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes, loading } = this.props;
        if (loading) {
            return (<Loading/>);
        } else {
            return (
                <div>
                    <Typography component="p">
                        Load data about a specific GitHub repository
                    </Typography>
                    <OrgRepoName/>
                </div>
            );
        }
    }
}

Repo.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loading: state.githubScanRepo.loading,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Repo));