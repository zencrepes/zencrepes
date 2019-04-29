import React, { Component } from 'react';
import PropTypes from "prop-types";
import ReactMarkdown from 'react-markdown';

import CustomCard from "../../../components/CustomCard/index.js";
import {connect} from "react-redux";

class Summary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            projects,
            selectedSprintLabel,
        } = this.props;
        if (projects[0] !== undefined && projects[0].name !== undefined) {
            const project = projects[0];
            let projecTitle = project.name;
            if (selectedSprintLabel !== 'no-filter') {
                projecTitle = projecTitle + ' (' + selectedSprintLabel + ')'
            }
            return (
                <CustomCard
                    headerTitle={projecTitle}
                    headerFactTitle=""
                    headerFactValue=""
                >
                    <ReactMarkdown source={project.body} />
                </CustomCard>
            );
        } else {
            return null;
        }
    }
}

Summary.propTypes = {
    projects: PropTypes.array.isRequired,
    selectedSprintLabel: PropTypes.string.isRequired,
};

const mapState = state => ({
    projects: state.projectView.projects,
    selectedSprintLabel: state.projectView.selectedSprintLabel,
});

export default connect(mapState, null)(Summary);