import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { setLoadFlag, setStageFlag, setIssues, verifiedIssues } = this.props;
        setIssues(verifiedIssues.filter(issue => issue.error === false).map(issue => issue.create));
        setStageFlag(false);
        setLoadFlag(true);
    };

    render() {
        const { verifiedIssues, issues } = this.props;

        const errors = verifiedIssues.filter(issue => issue.error === true);
        //The apply button is disabled until all issues have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="contained"
                color="primary"
                disabled={verifiedIssues.filter(issue => issue.error === false).length !== issues.length}
                onClick={this.apply}
            >
                Apply
                {errors.length > 0 &&
                    <span>
                        ({errors.length} errors)
                    </span>
                }
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    verifiedIssues: PropTypes.array.isRequired,
    issues: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setIssues: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedIssues: state.issuesCreate.verifiedIssues,
    issues: state.issuesCreate.issues,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesCreate.setLoadFlag,
    setStageFlag: dispatch.issuesCreate.setStageFlag,
    setIssues: dispatch.issuesCreate.setIssues,
});

export default connect(mapState, mapDispatch)(ApplyButton);