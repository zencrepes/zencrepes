import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { reposIssues, changeActiveStep, setLoadFlag, setLoadRepos  } = this.props;
        if (reposIssues === 0) {
            changeActiveStep(1);
        } else {
            setLoadRepos([]);
            setLoadFlag(true);
        }
    };

    render() {
        return (
            <Button
                color="primary"
                onClick={this.apply}
            >
                OK
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    reposIssues: PropTypes.array.isRequired,
    changeActiveStep: PropTypes.func.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoadRepos: PropTypes.func.isRequired,
};

const mapState = state => ({
    reposIssues: state.wizardView.reposIssues,
});

const mapDispatch = dispatch => ({
    changeActiveStep: dispatch.wizardView.changeActiveStep,

    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});

export default connect(mapState, mapDispatch)(ApplyButton);