import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import {buildMongoSelector} from "../../../utils/mongo";
import {cfgIssues} from "../../../data/Minimongo";

import ProgressBar from "../../../components/Loading/Issues/ProgressBar";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class DeleteClosedEmptyButton extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    deleteClosedEmpty = () => {
        console.log('deleteClosedEmpty');
        const { milestones, setLoadFlag, setMilestones, setAction } = this.props;
        console.log('TODO- THIS ACTION IS CURRENTLY COMMENTED OUT !')
        console.log(milestones);
        console.log(milestones.filter(m => m.state.toLowerCase() === 'closed').filter(m => m.issues.totalCount === 0));
//        setMilestones(milestonesdata.milestones.filter(m => m.state.toLowerCase() === 'closed').filter(m => m.issues.totalCount === 0));
//        setAction('deleteClosedEmpty');
//        setLoadFlag(true);
    };

    render() {
        const { classes, loading } = this.props;

        return (
            <div className={classes.root}>
                {!loading &&
                    <div>
                        <Button variant="raised" color="primary" className={classes.button} onClick={this.deleteClosedEmpty}>
                            Deleted closed and empty Milestones
                        </Button>
                    </div>
                }
            </div>
        );
    };
}

DeleteClosedEmptyButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.githubFetchMilestones.loading,
    milestones: state.milestones.milestones,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchMilestones.setLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(DeleteClosedEmptyButton));
