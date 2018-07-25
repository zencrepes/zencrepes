import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

class OrgRepoName extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

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
        const { classes, name } = this.props;
        return (
            <div >
                <TextField
                    id="orgName"
                    label="GitHub Organization"
                    className={classes.textField}
                    value={name}
                    onChange={this.changeOrgName('name')}
                    margin="normal"
                />
                <TextField
                    id="repoName"
                    label="Repository"
                    className={classes.textField}
                    value={name}
                    onChange={this.changeRepoName('name')}
                    margin="normal"
                />
                <Button color="primary" className={classes.button} onClick={this.handleScanRepo}>
                    Scan Repo
                </Button>
            </div>
        );
    }
}

OrgRepoName.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loadFlag: state.githubScanRepo.loadFlag,
    name: state.githubScanRepo.name,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubScanRepo.setLoadFlag,
    setOrgName: dispatch.githubScanRepo.setOrgName,
    setRepoName: dispatch.githubScanRepo.setRepoName,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(OrgRepoName));