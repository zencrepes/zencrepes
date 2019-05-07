import React, { Component } from 'react';

import PropTypes from "prop-types";
import {connect} from "react-redux";

class Notes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { issues, maxIssuesGraph } = this.props;

        return (
            <React.Fragment>
                {issues.length > maxIssuesGraph &&
                    <span>Your input dataset is over {maxIssuesGraph} issues, some entry nodes have been dropped !</span>
                }
                <br />
                <span><u><b>Legend:</b></u></span><br />
                <span> - Circle: Issue currently in database</span><br />
                <span> - Rectangle: Issue missing from database</span><br />
                <span> - Red: Issue closed</span><br />
                <span> - Green: Issue open</span><br />
                <span> - Large: Issue in query</span><br />
                <span> - Small: Issue fetched through links</span><br />
            </React.Fragment>
        );
    }
}

Notes.propTypes = {
    issues: PropTypes.array.isRequired,
    maxIssuesGraph: PropTypes.number.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
    maxIssuesGraph: state.issuesView.maxIssuesGraph,
});

export default connect(mapState, null)(Notes);

