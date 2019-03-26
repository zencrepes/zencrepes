import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { setLoadFlag, setStageFlag } = this.props;
        setStageFlag(false);
        setLoadFlag(true);
    };

    render() {
        const { verifiedProjects, projects } = this.props;

        const errors = verifiedProjects.filter(project => project.error === true);

        //The apply button is disabled until all projects have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="contained"
                color="primary"
                disabled={verifiedProjects.filter(project => project.error === false).length !== projects.length}
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
    verifiedProjects: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedProjects: state.projectsEdit.verifiedProjects,
    projects: state.projectsEdit.projects,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.projectsEdit.setLoadFlag,
    setStageFlag: dispatch.projectsEdit.setStageFlag,
});

export default connect(mapState, mapDispatch)(ApplyButton);