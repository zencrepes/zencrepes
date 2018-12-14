import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
class LoadButton extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    loadMilestones = () => {
        console.log('loadMilestones');
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, loading } = this.props;

        return (
            <div className={classes.root}>
                {!loading &&
                <div>
                    <Button variant="raised" color="primary" className={classes.button} onClick={this.loadMilestones}>
                        Load/Refresh Milestones
                    </Button>
                </div>
                }
            </div>
        );
    };
}

LoadButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.milestonesFetch.loading,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesFetch.setLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadButton));
