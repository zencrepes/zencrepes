import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';

import CalendarIcon from 'mdi-react/CalendarIcon';

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

    refreshAllRepos = () => {
        const { setLoadFlag, setLoadRepos, setOnSuccess, updateView  } = this.props;
        setOnSuccess(updateView);
        setLoadRepos([]);
        setLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <div
                    style={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}
                >
                    <CalendarIcon size={64} /><br />
                    <span>No Milestones in memory</span><br />
                    <Button
                        onClick={this.refreshAllRepos}
                    >
                        <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Load Milestones
                    </Button>
                </div>
            </React.Fragment>
        );
    }
}

NoData.propTypes = {
    classes: PropTypes.object.isRequired,
    milestones: PropTypes.array.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoadRepos: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,

    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesFetch.setLoadFlag,
    setLoadRepos: dispatch.milestonesFetch.setLoadRepos,
    updateView: dispatch.milestonesView.updateView,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(NoData));

