import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Stats from './Stats/index.js';
import Summary from './Summary/index.js';
import Burndown from './Burndown/index.js';
import Velocity from './Velocity/index.js';
import IssuesList from './IssuesList/index.js';
import Contributions from './Contributions/index.js';
import Graph from './Graph/index.js';

class IssuesContent extends Component {
    constructor (props) {
        super(props);
    }

    handleChange = (event, value) => {
        this.setState({ selectedTab: value });
    };

    render() {
        const { selectedTab } = this.props;
        return (
            <React.Fragment>
                {{
                    'stats': <Stats />,
                    'list': <IssuesList />,
                    'work': <Summary />,
                    'contributions': <Contributions />,
                    'graph': <Graph />,
                    'velocity': <Velocity />,
                    'burndown': <Burndown />,
                }[selectedTab]}
            </React.Fragment>
        );
    }
}

IssuesContent.propTypes = {
    selectedTab: PropTypes.string.isRequired,
};

const mapState = state => ({
    selectedTab: state.issuesView.selectedTab,
});

export default connect(mapState, null)(IssuesContent);
