import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { setLoadFlag, setStageFlag, repos } = this.props;
        setStageFlag(false);
        setLoadFlag(true);
    };

    render() {
        const { verifiedRepos, repos } = this.props;

        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="contained"
                color="primary"
                disabled={verifiedRepos.filter(repo => repo.error === false).length !== repos.length}
                onClick={this.apply}
            >
                Apply
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    verifiedRepos: PropTypes.array.isRequired,
    repos: PropTypes.array.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedRepos: state.milestonesCreate.verifiedRepos,
    repos: state.milestonesCreate.repos,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesCreate.setLoadFlag,
    setStageFlag: dispatch.milestonesCreate.setStageFlag,
});

export default connect(mapState, mapDispatch)(ApplyButton);