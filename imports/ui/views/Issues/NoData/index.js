import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import ClearIcon from '@material-ui/icons/Clear';

import ViewDashboardIcon from 'mdi-react/ViewDashboardIcon';

const styles = theme => ({
    root: {
        margin: '10px',
        border: `1px solid ${theme.palette.divider}`,
    },
    query: {
        flex: 1,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});

class NoData extends Component {
    constructor (props) {
        super(props);
    }

    clearQuery = () => {
        const { setUpdateQueryPath, setUpdateQuery } = this.props;
        setUpdateQuery({});
        setUpdateQueryPath('/issues/stats');
    };

    refreshAllRepos = () => {
        const { setLoadFlag, setLoadRepos, setOnSuccess, updateView  } = this.props;
        setOnSuccess(updateView);
        setLoadRepos([]);
        setLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, query } = this.props;

        return (
            <React.Fragment>
                <div
                    style={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}
                >
                    <ViewDashboardIcon size={64} /><br />
                    {!_.isEmpty(query) ? (
                        <React.Fragment>
                            <span>No issues found, try clearing your query</span><br />
                            <Button
                                onClick={this.clearQuery}
                            >
                                <ClearIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                Clear Query
                            </Button>
                        </React.Fragment>
                    ): (
                        <React.Fragment>
                            <span>No Issues in memory</span><br />
                            <Button
                                onClick={this.refreshAllRepos}
                            >
                                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                Load Issues
                            </Button>
                        </React.Fragment>
                    )}

                </div>
            </React.Fragment>
        );
    }
}

NoData.propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoadRepos: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,

    updateView: PropTypes.func.isRequired,
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,

    updateView: dispatch.issuesView.updateView,

    setOnSuccess: dispatch.loading.setOnSuccess,

    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

const mapState = state => ({
    query: state.issuesView.query,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(NoData));

