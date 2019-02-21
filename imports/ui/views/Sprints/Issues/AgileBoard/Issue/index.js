import React, { Component } from 'react';
import PropTypes from "prop-types";

import IssueItem from './issueItem.js';

class Issue extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { provided, innerRef, issue } = this.props;
        return (
            <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={innerRef}
            >
                <IssueItem issue={issue}/>
            </div>
        );
    }
}

Issue.propTypes = {
    provided: PropTypes.object.isRequired,
    innerRef: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
};

export default Issue;
