import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

class RemoveButton extends Component {
    constructor (props) {
        super(props);
    }

    remove = () => {
        const { issue, issues, setIssues, verifiedIssues, setVerifiedIssues } = this.props;
        setIssues(
            issues.filter(ms => ms.id !== issue.id)
        );
        setVerifiedIssues(
            verifiedIssues.filter(ms => ms.id !== issue.id)
        );
    };

    render() {
        return (
            <IconButton aria-label="Delete" onClick={this.remove}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        );
    }
}

RemoveButton.propTypes = {
    verifiedIssues: PropTypes.array.isRequired,
    issues: PropTypes.array.isRequired,
    issue: PropTypes.object.isRequired,

    setIssues: PropTypes.func.isRequired,
    setVerifiedIssues: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedIssues: state.issuesCreate.verifiedIssues,
    issues: state.issuesCreate.issues,
});

const mapDispatch = dispatch => ({
    setIssues: dispatch.issuesCreate.setIssues,
    setVerifiedIssues: dispatch.issuesCreate.setVerifiedIssues
});

export default connect(mapState, mapDispatch)(RemoveButton);
