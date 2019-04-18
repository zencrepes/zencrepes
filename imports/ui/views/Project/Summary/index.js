import React, { Component } from 'react';
import PropTypes from "prop-types";
import ReactMarkdown from 'react-markdown';

import CustomCard from "../../../components/CustomCard/index.js";

class Summary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            projects,
        } = this.props;
        if (projects[0] !== undefined && projects[0].name !== undefined) {
            const project = projects[0];
            return (
                <CustomCard
                    headerTitle={project.name}
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
};

export default Summary;
