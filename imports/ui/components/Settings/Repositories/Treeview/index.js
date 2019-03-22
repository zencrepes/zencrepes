import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from '@material-ui/core/Typography';

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import Input from '@material-ui/core/Input';

import {reactLocalStorage} from 'reactjs-localstorage';

const styles = {
    root: {
        margin: '10px',
        width: '100%',
    },
    card: {
        height: '300px',
        overflow: 'auto',
    },
    cardHistory: {
        overflow: 'auto',
    },
    title: {
        fontSize: 14,
    },
    details: {
        fontSize: 12,
    },
    cardContent: {
        paddingBottom: '0px',
    },
    input: {
        marginLeft: '5px',
        width: '30px',
    },
};

class Treeview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: [],
        };
    }

    /*
    // If open treeview with no data, try loading data affiliated with the user
    componentDidMount() {
        const { availableRepos, setLoadFlag, connectedUser, setLogin, initView, setOnSuccess } = this.props;
        if (availableRepos.length === 0) {
            setLogin(connectedUser.login);
            setOnSuccess(initView);
            setLoadFlag(true);
        }
    }
    */
    checkNode = (checked) => {
        const { updateCheckedRepos } = this.props;
        updateCheckedRepos(checked);
    };

    render() {
        const { classes, treeNodes, selectedRepos} = this.props;

        return (
            <React.Fragment>
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Available Organizations and Repositories
                        </Typography>
                        {treeNodes.length === 0 &&
                            <Typography className={classes.title} color="textPrimary">
                                Please load data first
                            </Typography>
                        }
                        <CheckboxTree
                            nodes={treeNodes}
                            checked={selectedRepos.map(repo => repo.id)}
                            expanded={this.state.expanded}
                            onCheck={this.checkNode}
                            onExpand={expanded => this.setState({ expanded })}
                        />
                    </CardContent>
                </Card>
            </div>
            <div className={classes.root}>
                <Card className={classes.cardHistory}>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Initial Data Fetch
                        </Typography>
                        <div className={classes.details} color="textPrimary">
                            Limit dataset to issues updated in the last
                            <Input
                                defaultValue={reactLocalStorage.get('issuesHistoryLoad', 12)}
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'Description',
                                }}
                                onChange={(event)=> {
                                    reactLocalStorage.set('issuesHistoryLoad', parseInt(event.target.value));
                                }}
                            />
                            Months.
                            <br />
                            <i>Note: Changing this parameter does not impact repositories for which issues were already loaded. To apply to existing repositories, please clear all issues first.</i>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </React.Fragment>
        );
    }
}

Treeview.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    selectedRepos: PropTypes.array.isRequired,
    availableRepos: PropTypes.array.isRequired,
    treeNodes: PropTypes.array.isRequired,
    connectedUser: PropTypes.object,

    updateCheckedRepos: PropTypes.func.isRequired,
    setLogin: PropTypes.func.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    initView: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
};

const mapState = state => ({
    loading: state.loading.loading,
    selectedRepos: state.settingsView.selectedRepos,
    availableRepos: state.settingsView.availableRepos,
    treeNodes: state.settingsView.treeNodes,
    connectedUser: state.usersView.connectedUser,
});

const mapDispatch = dispatch => ({
    updateCheckedRepos: dispatch.settingsView.updateCheckedRepos,

    setLogin: dispatch.githubFetchOrgs.setLogin,
    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,

    initView: dispatch.settingsView.initView,
    setOnSuccess: dispatch.loading.setOnSuccess,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Treeview));