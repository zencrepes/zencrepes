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
        marginBottom: 16,
        fontSize: 14,
    },

    cardActions: {
        display: 'grid',
        height: '100%',
        gridTemplateColumns: 'auto 300px',
        gridTemplateRows: ,
        gridTemplateAreas: 'abc def',
    },
    boxtextfield: {
        gridArea: 'abc',
    },
    textField: {
        width: '100%',
    },
    boxbutton: {
        gridArea: 'def',
    },
    button: {
        width: '150px',
    },
    cardContent: {
        paddingBottom: '0px',
    },
    actionButtons: {
        textAlign: 'right',
    },

});

class ScanOrgRepos extends Component {
    constructor(props) {
        super(props);
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

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <Typography className={classes.title} color="textSecondary">
                            Load from a GitHub Organization
                        </Typography>
                        {loading ? (
                            <div className={classes.loading}>
                                <LinearProgress />
                                <Typography component="p">
                                    Fetching repositories from {name} ... {loadedRepos} / {availableRepos}
                                </Typography>
                            </div>
                        ) : (
                            <Typography component="p">
                                Load all repositories attached to a particular GitHub organization.
                            </Typography>
                        )}
                    </CardContent>
                    <CardActions>
                        <div className={classes.cardActions}>
                            <div className={classes.boxtextfield}>
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
                            </div>
                            <div className={classes.boxbutton}>
                                <Button color="primary" variant="raised" className={classes.button} onClick={this.handleScanOrg}>
                                    Load Org
                                </Button>
                            </div>
                        </div>
                    </CardActions>
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