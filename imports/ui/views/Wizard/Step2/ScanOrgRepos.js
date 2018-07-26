import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

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

    handleChange = name => event => {
        const { setName } = this.props;
        setName(event.target.value);
    };

    handleScanOrg = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadError, name, availableRepos, loadedRepos } = this.props;
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
                        helperText={loadError && "Unable to fetch data from Org"}
                        onChange={this.handleChange('name')}
                        margin="normal"
                    />
                    <Button color="primary" className={classes.button} onClick={this.handleScanOrg}>
                        Scan Org
                    </Button>
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
    name: state.githubFetchOrgRepos.name,
    loading: state.githubFetchOrgRepos.loading,
    loadError: state.githubFetchOrgRepos.loadError,
    availableRepos: state.githubFetchOrgRepos.availableRepos,
    loadedRepos: state.githubFetchOrgRepos.loadedRepos,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgRepos.setLoadFlag,
    setName: dispatch.githubFetchOrgRepos.setName,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ScanOrgRepos));