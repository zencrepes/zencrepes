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

class ScanOrgRepos extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess, setName } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
                setName('');
            }, 2000);
        }
    };

    handleChange = name => event => {
        const { setName } = this.props;
        setName(event.target.value);
    };

    handleScanOrg = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadError, loadSuccess, name, availableRepos, loadedRepos } = this.props;
        if (loading) {
            return (
                <div className={classes.loading}>
                    <LinearProgress />
                    <Typography component="p">
                        Fetching repositories from {name} ... {loadedRepos} / {availableRepos}
                    </Typography>
                </div>
            );
        } else {
            return (
                <div>
                    <TextField
                        id="orgName"
                        error={loadError}
                        label="GitHub Organization"
                        className={classes.textField}
                        value={name}
                        helperText={loadError && "Unable to fetch data from organiation"}
                        onChange={this.handleChange('name')}
                        margin="normal"
                    />
                    <Button color="primary" className={classes.button} onClick={this.handleScanOrg}>
                        Scan Org
                    </Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                        open={loadSuccess}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Found {loadedRepos} repositories from {name}</span>}
                    />
                </div>
            );
        }
    }
}

ScanOrgRepos.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loadFlag: state.githubFetchOrgRepos.loadFlag,
    loading: state.githubFetchOrgRepos.loading,
    loadError: state.githubFetchOrgRepos.loadError,
    loadSuccess: state.githubFetchOrgRepos.loadSuccess,
    availableRepos: state.githubFetchOrgRepos.availableRepos,
    loadedRepos: state.githubFetchOrgRepos.loadedRepos,
    name: state.githubFetchOrgRepos.name,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgRepos.setLoadFlag,
    setName: dispatch.githubFetchOrgRepos.setName,
    setLoadSuccess: dispatch.githubFetchOrgRepos.setLoadSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ScanOrgRepos));