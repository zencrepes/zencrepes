import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class RefreshButton extends Component {
    constructor (props) {
        super(props);
    }

    edit = () => {
        const {
            issuesSetStageFlag,
            issuesSetVerifFlag,
            issuesSetIssues,
            issuesSetAction,
            issues,
            issuesSetOnSuccess,
            sprintsUpdateView,
            issuesSetVerifying
        } = this.props;
        issuesSetOnSuccess(sprintsUpdateView);
        issuesSetIssues(issues);
        issuesSetAction('refresh');
        issuesSetVerifying(true);
        issuesSetStageFlag(true);
        issuesSetVerifFlag(true);
    };

    render() {
        return (
            <Tooltip title="Refresh these issues only">
                <IconButton aria-label="Refresh" onClick={this.edit}>
                    <RefreshIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    }
}

RefreshButton.propTypes = {
    issues: PropTypes.array.isRequired,

    issuesSetStageFlag: PropTypes.func.isRequired,
    issuesSetVerifFlag: PropTypes.func.isRequired,
    issuesSetVerifying: PropTypes.func.isRequired,
    issuesSetIssues: PropTypes.func.isRequired,
    issuesSetAction: PropTypes.func.isRequired,
    issuesSetOnSuccess: PropTypes.func.isRequired,
    sprintsUpdateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    issues: state.sprintsView.issues,
});

const mapDispatch = dispatch => ({
    issuesSetStageFlag: dispatch.issuesEdit.setStageFlag,
    issuesSetVerifFlag: dispatch.issuesEdit.setVerifFlag,
    issuesSetVerifying: dispatch.issuesEdit.setVerifying,
    issuesSetIssues: dispatch.issuesEdit.setIssues,
    issuesSetAction: dispatch.issuesEdit.setAction,
    issuesSetOnSuccess: dispatch.issuesEdit.setOnSuccess,
    sprintsUpdateView: dispatch.sprintsView.updateView,

});

export default connect(mapState, mapDispatch)(RefreshButton);
