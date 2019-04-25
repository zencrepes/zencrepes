import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class IssuesTabs extends Component {
    constructor (props) {
        super(props);
    }

    handleChange = (event, value) => {
        const { changeTab } = this.props;
        changeTab(value);
    };

    render() {
        const { selectedTab } = this.props;
        return (
            <Tabs
                value={selectedTab}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="Explore" value="stats" />
                <Tab label="List" value="list" />
                <Tab label="Plan" value="work" />
                <Tab label="Velocity" value="velocity" />
                <Tab label="Burndown" value="burndown" />
                <Tab label="Past 4 weeks" value="contributions" />
            </Tabs>
        );
    }
}

IssuesTabs.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    changeTab: PropTypes.func.isRequired,
};

const mapState = state => ({
    selectedTab: state.issuesView.selectedTab,
});

export default connect(mapState, null)(IssuesTabs);
