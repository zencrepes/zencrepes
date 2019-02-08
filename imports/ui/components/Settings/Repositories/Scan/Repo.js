import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid/Grid";
import {withStyles} from "@material-ui/core";
import Input from '@material-ui/core/Input';
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";

const styles = {
    root: {
        width: '100%',
        margin: '10px',
    },
    title: {
        fontSize: 14,
    },
    details: {
        fontSize: 12,
    },
    input: {
        width: '100%',
    },
};

class Repo extends Component {
    constructor(props) {
        super(props);
    }

    loadRepo = () => {
        const { setLoadFlag, initView, setOnSuccess  } = this.props;
        setOnSuccess(initView);
        setLoadFlag(true);
    };

    handleChangeOrgName = (event) => {
        const { setOrgName } = this.props;
        setOrgName(event.target.value);
    };

    handleChangeRepoName = (event) => {
        const { setRepoName } = this.props;
        setRepoName(event.target.value);
    };

    render() {
        const { classes, loading, orgName, repoName } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary">
                        An Individual Repository
                    </Typography>
                    <Typography className={classes.details} color="textPrimary">
                        Add an individual repository. The repository and its organization must be configured to allow such an operation.
                    </Typography>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={6} sm container>
                            <Input
                                placeholder="Organization name"
                                inputProps={{
                                    'aria-label': 'Description',
                                }}
                                value={orgName}
                                className={classes.input}
                                onChange={this.handleChangeOrgName}
                            />
                        </Grid>
                        <Grid item xs={6} sm container>
                            <Input
                                placeholder="Repository name"
                                inputProps={{
                                    'aria-label': 'Description',
                                }}
                                value={repoName}
                                className={classes.input}
                                onChange={this.handleChangeRepoName}
                            />
                        </Grid>
                    </Grid>

                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={this.loadRepo} disabled={loading}>
                        Scan
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

Repo.propTypes = {
    classes: PropTypes.object.isRequired,
    orgName: PropTypes.string,
    repoName: PropTypes.string,
    loading: PropTypes.bool.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setOrgName: PropTypes.func.isRequired,
    setRepoName: PropTypes.func.isRequired,
    initView: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchRepo.setLoadFlag,
    setOrgName: dispatch.githubFetchRepo.setOrgName,
    setRepoName: dispatch.githubFetchRepo.setRepoName,

    initView: dispatch.settingsView.initView,
    setOnSuccess: dispatch.loading.setOnSuccess,
});


const mapState = state => ({
    orgName: state.githubFetchRepo.orgName,
    repoName: state.githubFetchRepo.repoName,

    loading: state.loading.loading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Repo));
