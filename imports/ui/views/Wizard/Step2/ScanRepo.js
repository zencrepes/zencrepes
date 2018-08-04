import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
    root: {
        margin: '10px',
    },
    title: {
        fontSize: 14,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: '0px',
        width: 100,
    },
    cardActions: {
        paddingTop: '0px',
        display: 'inline',
    },
    button: {
        width: '120px',
    },
    cardContent: {
        paddingBottom: '0px',
    },
});

class ScanRepo extends Component {
    constructor(props) {
        super(props);
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
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Individual Repository
                        </Typography>
                        {loading &&
                            <div className={classes.loading}>
                                <LinearProgress />
                                <Typography component="p">
                                    Fetching {repoName} Repository from {orgName} Organization ...
                                </Typography>
                            </div>
                        }
                    </CardContent>
                    {!loading &&
                        <CardActions >
                            <div className={classes.cardActions}>
                                <TextField
                                    id="orgName"
                                    label="Organization"
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
                                <Button color="primary" variant="raised" className={classes.button} onClick={this.handleScanRepo}>
                                    Add Repo
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
                    message={<span id="message-id">Loaded {repoName} from {orgName}</span>}
                />
            </div>
        );
    }
}

ScanRepo.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    loadError: PropTypes.bool,
    loadSuccess: PropTypes.bool,
    orgName: PropTypes.string,
    repoName: PropTypes.string,
    setLoadFlag: PropTypes.func,
    setLoadSuccess: PropTypes.func,
    setOrgName: PropTypes.func,
    setRepoName: PropTypes.func,
};

const mapState = state => ({
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