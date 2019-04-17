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
            project,
        } = this.props;
        return (
            <CustomCard
                headerTitle={project.name}
                headerFactTitle=""
                headerFactValue=""
            >
                <ReactMarkdown source={project.description} />
            </CustomCard>
        );
    }
}

Summary.propTypes = {
    project: PropTypes.object.isRequired,
};

export default Summary;
