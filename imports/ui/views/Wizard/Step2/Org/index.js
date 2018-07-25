import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import OrgName from './OrgName.js';
import Treeview from './Treeview.js';
import Loading from './Loading.js';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
    },
});

class Org extends Component {
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
                        Load all available repositories from a GitHub organization
                    </Typography>
                    <OrgName/>
                    <Treeview/>
                </div>
            );
        }
    }
}

Org.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loading: state.githubScanOrg.loading,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Org));