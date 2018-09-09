import _ from 'lodash';
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

import TextField from '@material-ui/core/TextField';

import { cfgSources } from "../../../data/Minimongo.js";

import FetchZenhubPoints from '../../../data/FetchZenhubPoints.js';

import Tree from '../../../components/Settings/Repositories/Treeview/Tree.js';

const styles = theme => ({
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
});

class Zenhub extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { setLoadFlag } = this.props;
        if (cfgSources.find({}).count() === 0) {
            setLoadFlag(true);
        }
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

    reloadRepos = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    handleChange = name => event => {
        const { setToken } = this.props;
        setToken(event.target.value);
    };


    render() {
        const { classes, loading, loadSuccess, loadedIssues, paused, resumeIn, token, rateLimitPause, message } = this.props;
        return (
            <div className={classes.root}>
                <FetchZenhubPoints />
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Import points from Zenhub
                        </Typography>
                        <Typography>
                            Calls to Zenhub API are limited to 100 per minute without concurrent calls. Depending of the number of issues, this can be a lengthy process. <br />
                            If interrupted, the system will not re-load issues for which points were previously obtained.
                        </Typography>
                        <TextField
                            id="full-width"
                            label="Zenhub API Key"
                            value={token}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                            onChange={this.handleChange()}
                        />
                        <Typography>
                            Select repositories and organizations to import Zenhub points from:
                        </Typography>
                        <Tree all={{active: true}} selected={{active: true, fetchZenhub: true}} enable={{fetchZenhub: true}} disable={{fetchZenhub: false}} />
                        {loading &&
                        <div className={classes.loading}>
                            <LinearProgress />
                            <Typography component="p">
                                {message} <br /> {loadedIssues > 0 && "Scanned " + loadedIssues + " issues"}
                            </Typography>
                            {paused &&
                                <Typography component="p">
                                    Importing from Zenhub is currently paused for {rateLimitPause/1000} to avoid hitting rate limit. <br />
                                    Will resume in {resumeIn} seconds.
                                </Typography>
                            }
                        </div>
                        }
                    </CardContent>
                    {!loading &&
                    <CardActions className={classes.cardActions} >
                        <div className={classes.actionButtons} >
                            <Button color="primary" variant="raised" className={classes.button} onClick={this.reloadRepos}>
                                Load Points
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
                    message={<span id="message-id">Scan {loadedIssues} issues for Zenhub points</span>}
                />
            </div>
        );
    }
}

Zenhub.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    loadSuccess: PropTypes.bool,
    createdLabels: PropTypes.number,
    updatedRepos: PropTypes.number,
    setLoadFlag: PropTypes.func,
    setLoadSuccess: PropTypes.func,
};

const mapState = state => ({
    loading: state.zenhub.loading,
    loadSuccess: state.zenhub.loadSuccess,

    loadedIssues: state.zenhub.loadedIssues,
    token: state.zenhub.token,
    paused: state.zenhub.paused,
    message: state.zenhub.message,
    rateLimitPause: state.zenhub.rateLimitPause,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.zenhub.setLoadFlag,
    setLoadSuccess: dispatch.zenhub.setLoadSuccess,

    setToken: dispatch.zenhub.setToken,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Zenhub));