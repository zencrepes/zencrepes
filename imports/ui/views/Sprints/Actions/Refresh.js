import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class Refresh extends Component {
    constructor (props) {
        super(props);
    }

    refreshRepos = () => {
        const { setLoadFlag, setLoadRepos, milestones } = this.props;
        console.log(milestones);
        setLoadRepos(milestones.map(milestone => milestone.repo.id));
        setLoadFlag(true);

    };

    render() {
        const { classes } = this.props;
        return (
            <Button variant="contained" color="primary" onClick={this.refreshRepos}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Repos in Sprint
            </Button>
        )
    }
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    milestones: PropTypes.array.isRequired,
    repositories: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoadRepos: PropTypes.func.isRequired,
};

const mapState = state => ({
    loading: state.issuesFetch.loading,
    milestones: state.sprintsView.milestones,
    repositories: state.sprintsView.repositories,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
