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
        width: '100%',
    },
    title: {
        fontSize: 14,
    },
    cardActions: {
        paddingTop: '0px',
        display: 'inline',
    },
    cardContent: {
        paddingBottom: '0px',
    },
    actionButtons: {
        textAlign: 'right',
    },
    button: {
        width: '120px',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: '0px',
        width: 100,
    },
});

class ScanOrgRepos extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        const { loadSuccess, setLoadSuccess, setName } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
                setName('');
            }, 2000);
        }
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
        const { classes, loading, loadError, loadSuccess, name, availableRepos, loadedRepos } = this.props;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <Typography className={classes.title} color="textSecondary">
                            GitHub Organization
                        </Typography>
                        {loading &&
                            <div className={classes.loading}>
                                <LinearProgress/>
                                <Typography component="p">
                                    Fetching repositories from {name} ... {loadedRepos} / {availableRepos}
                                </Typography>
                            </div>
                        }
                    </CardContent>
                    {!loading &&
                        <CardActions>
                            <div className={classes.cardActions}>
                                <TextField
                                    id="orgName"
                                    error={loadError}
                                    label="Organization"
                                    className={classes.textField}
                                    value={name}
                                    helperText={loadError && "Unable to fetch data from organization"}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                />
                                <Button color="primary" variant="contained" className={classes.button}
                                        onClick={this.handleScanOrg}>
                                    Add Org
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
                    message={<span id="message-id">Found {loadedRepos} repositories from {name}</span>}
                />
            </div>
        );
    }
}

ScanOrgRepos.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    loadError: PropTypes.bool,
    loadSuccess: PropTypes.bool,
    availableRepos: PropTypes.number,
    loadedRepos: PropTypes.number,
    name: PropTypes.string,
    setLoadFlag: PropTypes.func,
    setName: PropTypes.func,
    setLoadSuccess: PropTypes.func,
};

const mapState = state => ({
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