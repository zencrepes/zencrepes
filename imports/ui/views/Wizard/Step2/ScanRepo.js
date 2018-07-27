import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class ScanRepo extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess, setOrgName, setRepoName } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
                setOrgName('');
                setRepoName('');
            }, 2000);
        }
    };

    changeOrgName = name => event => {
        const { setOrgName } = this.props;
        setOrgName(event.target.value);
    };

    changeRepoName = name => event => {
        const { setRepoName } = this.props;
        setRepoName(event.target.value);
    };

    handleScanRepo = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, orgName, repoName, loading, loadError, loadSuccess } = this.props;
        if (loading) {
            return (
                <div className={classes.loading}>
                    <LinearProgress />
                    <Typography component="p">
                        Fetching {repoName} Repository from {orgName} Organization ...
                    </Typography>
                </div>
            );
        } else {
            return (
                <div>
                    <TextField
                        id="orgName"
                        label="GitHub Organization"
                        error={loadError}
                        helperText={loadError && "Error"}
                        className={classes.textField}
                        value={orgName}
                        onChange={this.changeOrgName('name')}
                        margin="normal"
                    />
                    <TextField
                        id="repoName"
                        label="Repository"
                        error={loadError}
                        className={classes.textField}
                        helperText={loadError && "Unable to fetch data from Org or Repo"}
                        value={repoName}
                        onChange={this.changeRepoName('name')}
                        margin="normal"
                    />
                    <Button color="primary" className={classes.button} onClick={this.handleScanRepo}>
                        Scan Repo
                    </Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                        open={loadSuccess}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Loaded {repoName} from {orgName}</span>}
                    />
                </div>
            );
        }
    }
}

ScanRepo.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loadFlag: state.githubFetchRepo.loadFlag,
    loading: state.githubFetchRepo.loading,
    loadError: state.githubFetchRepo.loadError,
    loadSuccess: state.githubFetchRepo.loadSuccess,
    orgName: state.githubFetchRepo.orgName,
    repoName: state.githubFetchRepo.repoName,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchRepo.setLoadFlag,
    setLoadSuccess: dispatch.githubFetchRepo.setLoadSuccess,
    setOrgName: dispatch.githubFetchRepo.setOrgName,
    setRepoName: dispatch.githubFetchRepo.setRepoName,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ScanRepo));