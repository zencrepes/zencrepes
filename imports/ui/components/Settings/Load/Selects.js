import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions';
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import ProgressBar from "../../Loading/Issues/ProgressBar";
import ProgressText from "../../Loading/Issues/ProgressText";

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: '10px',
    },
    listItem: {
        padding: '0px',
    },
    actionButtons: {
        textAlign: 'right',
    },
    loading: {
        flexGrow: 1,
    },
});

class Selects extends Component {
    constructor(props) {
        super(props);
    }

    loadIssues = () => {
        console.log('loadIssues');
        const { setLoadFlag, setIterateCurrent, setLoadedCount, setLoading } = this.props;

        setIterateCurrent(0);
        setLoadedCount(0);
        setLoading(true);  // Set to true to indicate milestones are actually loading.

        setLoadFlag(true);
    };

    cancelLoad = () => {
        console.log('cancelLoad');
        this.props.setLoading(false);
    };

    render() {
        const { classes, loading, loadSuccess, issuesLoadedCount  } = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    {loading &&
                        <CardContent className={classes.cardContent} >
                            <div className={classes.loading}>
                                <Button onClick={this.cancelLoad} color="primary" autoFocus>
                                    Cancel Load
                                </Button>
                            </div>
                        </CardContent>
                    }
                    {!loading &&
                        <CardActions className={classes.cardActions} >
                            <div className={classes.actionButtons} >
                                <Button color="primary" variant="raised" className={classes.button} onClick={this.loadIssues}>
                                    BIG LOAD BUTTON
                                </Button>
                            </div>
                        </CardActions>
                    }
                </Card>
            </div>
        );
    }
}

Selects.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    loadSuccess: PropTypes.bool,
    issuesLoadedCount: PropTypes.number,
    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
    setLoadSuccess: PropTypes.func,
};

const mapState = state => ({
    loading: state.issuesFetch.loading,
    loadSuccess: state.issuesFetch.loadSuccess,

    issuesLoadedCount: state.issuesFetch.loadedCount,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoading: dispatch.issuesFetch.setLoading,

    setIterateCurrent: dispatch.issuesFetch.setIterateCurrent,
    setLoadedCount: dispatch.issuesFetch.setLoadedCount,
    setLoading: dispatch.issuesFetch.setLoading,

    setLoadSuccess: dispatch.issuesFetch.setLoadSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Selects));