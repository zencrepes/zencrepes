import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import {buildMongoSelector} from "../../utils/mongo";
import {cfgIssues} from "../../data/Minimongo";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});

class Refresh extends Component {
    constructor (props) {
        super(props);
    }

    loadLabels = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, loading } = this.props;
        return (
            <div className={classes.root}>
                {!loading &&
                <div>
                    <Button variant="raised" color="primary" className={classes.button} onClick={this.loadLabels}>
                        Load/Refresh Labels
                    </Button>
                </div>
                }
            </div>
        );
    };
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.labelsFetch.loading,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsFetch.setLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
