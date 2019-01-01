import React, { Component } from 'react';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { cfgSources } from "../../../data/Minimongo.js";
import Tree from '../../../components/Settings/Repositories/Treeview/Tree.js';

const styles = {
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
};

class SyncLabels extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { setLoadFlag } = this.props;
        if (cfgSources.find({}).count() === 0) {
            setLoadFlag(true);
        }
    }

    componentDidUpdate(prevProps) {
        const { loadSuccess, setLoadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
        }
    }

    createLabels = () => {
        const { setLoadFlag, setAction } = this.props;
        setAction('create');
        setLoadFlag(true);
    };

    deleteLabel = () => {
        const { setLoadFlag, setAction } = this.props;
        setAction('delete');
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadSuccess, createdLabels, updatedRepos } = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Create Story Points labels in your repositories
                        </Typography>
                        <Typography>
                            Warning, this process can be lengthy. <br />
                            Please also note that this process is not mandatory, simply adding a label &apos;SP:x&apos; (with &apos;x&apos; being a number) though GitHub web interface is sufficient. <br />
                            Adding through this interface ensures consistency (label names, color, description) across repositories.
                        </Typography>
                        <Typography>
                            Select repositories and organizations to apply the modification to:
                        </Typography>
                        <Tree all={{active: true}} selected={{active: true, pushLabels: true}} enable={{pushLabels: true}} disable={{pushLabels: false}} />

                        {loading &&
                        <div className={classes.loading}>
                            <LinearProgress />
                            <Typography component="p">
                                Applied {createdLabels} labels modifications amongst {updatedRepos} Repositories.
                            </Typography>
                        </div>
                        }
                    </CardContent>
                    {!loading &&
                    <CardActions className={classes.cardActions} >
                        <div className={classes.actionButtons} >
                            <Button color="primary" variant="contained" className={classes.button} onClick={this.createLabels}>
                                Create Labels
                            </Button>
                            <Button color="primary" variant="contained" className={classes.button} onClick={this.deleteLabel}>
                                Delete Labels
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
                    message={<span id="message-id">Modified {createdLabels} labels amongst {updatedRepos} GitHub repositories</span>}
                />
            </div>
        );
    }
}

SyncLabels.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadSuccess: PropTypes.bool.isRequired,
    createdLabels: PropTypes.number.isRequired,
    updatedRepos: PropTypes.number.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
};

const mapState = state => ({
    loading: state.githubCreatePointsLabels.loading,
    loadSuccess: state.githubCreatePointsLabels.loadSuccess,
    createdLabels: state.githubCreatePointsLabels.createdLabels,
    updatedRepos: state.githubCreatePointsLabels.updatedRepos,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubCreatePointsLabels.setLoadFlag,
    setLoadSuccess: dispatch.githubCreatePointsLabels.setLoadSuccess,
    setAction: dispatch.githubCreatePointsLabels.setAction,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SyncLabels));