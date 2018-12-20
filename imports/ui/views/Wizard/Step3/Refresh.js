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

class Refresh extends Component {
    constructor(props) {
        super(props);
    }

    loadIssues = () => {
        console.log('loadIssues');
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    cancelLoad = () => {
        console.log('cancelLoad');
        const { setLoading } = this.props;
        setLoading(false);
    };

    render() {
        const { classes, loading } = this.props;
        return (
            <div className={classes.root}>
                {loading &&
                    <div className={classes.loading}>
                        <Button onClick={this.cancelLoad} color="primary" autoFocus>
                            Cancel Load
                        </Button>
                    </div>
                }
                {!loading &&
                    <div className={classes.actionButtons} >
                        <Button color="primary" variant="contained" className={classes.button} onClick={this.loadIssues}>
                            Refresh Issues
                        </Button>
                    </div>
                }
            </div>
        );
    }
}

Refresh.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
};

const mapState = state => ({
    loading: state.issuesFetch.loading,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoading: dispatch.issuesFetch.setLoading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));