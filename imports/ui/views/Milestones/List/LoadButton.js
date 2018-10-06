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
class LoadButton extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
        }
    };

    loadMilestones = () => {
        console.log('loadMilestones');
        const { setLoadFlag, setLoadedCount } = this.props;
        setLoadedCount(0);
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadSuccess, loadedCount } = this.props;

        return (
            <div className={classes.root}>
                {!loading &&
                <div>
                    <Button variant="raised" color="primary" className={classes.button} onClick={this.loadMilestones}>
                        Load/Refresh Milestones
                    </Button>
                </div>
                }
                {loading &&
                <ProgressBar/>
                }
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={loadSuccess}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Loaded or updated {loadedCount} milestones</span>}
                />
            </div>
        );
    };
}

LoadButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.githubFetchMilestones.loading,
    loadSuccess: state.githubFetchMilestones.loadSuccess,
    loadedCount: state.githubFetchMilestones.loadedCount,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchMilestones.setLoadFlag,
    setLoading: dispatch.githubFetchMilestones.setLoading,
    setLoadSuccess: dispatch.githubFetchMilestones.setLoadSuccess,
    setLoadedCount: dispatch.githubFetchMilestones.setLoadedCount,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadButton));
