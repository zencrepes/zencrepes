import React, { Component } from 'react';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { cfgSources } from "../../../data/Minimongo.js";

import PushPoints from '../../../data/PushPoints.js';

const styles = {
    root: {
        margin: '10px',
    },
    title: {
        fontSize: 14,
    },
    loading: {
        flexGrow: 1,
    },
    button: {
        width: '120px',
    },
    cardActions: {
        display: 'inline',
    },
    cardContent: {
        paddingBottom: '0px',
    },
    actionButtons: {
        textAlign: 'left',
    }
};

class Push extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { setLoadFlag } = this.props;
        if (cfgSources.find({}).count() === 0) {
            setLoadFlag(true);
        }
    }

    componentDidUpdate(prevProps) {
        const { loadSuccess, setLoadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
        }
    };

    reloadRepos = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadSuccess, updatedIssues, message } = this.props;
        return (
            <div className={classes.root}>
                <PushPoints />
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Push points to GitHub as labels
                        </Typography>
                        <Typography>
                            Attach the 'SP:X' label to all issues for which points have been imported from ZenHub or Waffle and push back to GitHub.
                        </Typography>
                        {loading &&
                        <div className={classes.loading}>
                            <LinearProgress />
                            <Typography component="p">
                                {message} <br /> {updatedIssues > 0 && ", Updated " + updatedIssues + " issues"}
                            </Typography>
                        </div>
                        }
                    </CardContent>
                    {!loading &&
                    <CardActions className={classes.cardActions} >
                        <div className={classes.actionButtons} >
                            <Button color="primary" variant="contained" className={classes.button} onClick={this.reloadRepos}>
                                Push Points
                            </Button>
                        </div>
                    </CardActions>
                    }
                </Card>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                    open={loadSuccess}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Updated points for {updatedIssues} issues in GitHub</span>}
                />
            </div>
        );
    }
}

Push.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadSuccess: PropTypes.bool.isRequired,
    createdLabels: PropTypes.number.isRequired,
    updatedRepos: PropTypes.number.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
};

const mapState = state => ({
    loading: state.githubPushPoints.loading,
    loadSuccess: state.githubPushPoints.loadSuccess,

    updatedIssues: state.githubPushPoints.updatedIssues,
    message: state.githubPushPoints.message,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubPushPoints.setLoadFlag,
    setLoadSuccess: dispatch.githubPushPoints.setLoadSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Push));