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

import FetchWafflePoints from '../../../data/FetchWafflePoints.js';

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

class Waffle extends Component {
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
        const { setBoardUrl } = this.props;
        setBoardUrl(event.target.value);
    };


    render() {
        const { classes, loading, loadSuccess, loadedIssues, boardUrl, rateLimitPause, message } = this.props;
        return (
            <div className={classes.root}>
                <FetchWafflePoints />
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Load points from Waffle
                        </Typography>
                        <Typography>
                            Loading data from Waffle.io is limited to public boards and non-archived issues.
                        </Typography>
                        <TextField
                            id="full-width"
                            label="Waffle board URL"
                            value={boardUrl}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                            onChange={this.handleChange()}
                        />
                        {loading &&
                        <div className={classes.loading}>
                            <LinearProgress />
                            <Typography component="p">
                                {message} <br /> {loadedIssues > 0 && ", Scanned " + loadedIssues + " issues"}
                            </Typography>
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
                    message={<span id="message-id">Loaded points from {loadedIssues} issues</span>}
                />
            </div>
        );
    }
}

Waffle.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    loadSuccess: PropTypes.bool,
    createdLabels: PropTypes.number,
    updatedRepos: PropTypes.number,
    setLoadFlag: PropTypes.func,
    setLoadSuccess: PropTypes.func,
};

const mapState = state => ({
    loading: state.waffle.loading,
    loadSuccess: state.waffle.loadSuccess,

    loadedIssues: state.waffle.loadedIssues,
    boardUrl: state.waffle.boardUrl,
    message: state.waffle.message,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.waffle.setLoadFlag,
    setLoadSuccess: dispatch.waffle.setLoadSuccess,

    setBoardUrl: dispatch.waffle.setBoardUrl,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Waffle));