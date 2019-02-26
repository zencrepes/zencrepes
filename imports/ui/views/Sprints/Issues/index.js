import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import IssuesTable from "../../../components/IssuesTable/index.js";
import CustomCard from "../../../components/CustomCard/index.js";

import AgileBoard from './AgileBoard/index.js';

import RefreshButton from './RefreshButton.js';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Issues extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'list',
        };
    }

    handleChange = (event, value) => {
        this.setState({ selectedTab: value });
    };

    render() {
        const { issues } = this.props;

        return (
            <CustomCard
                headerTitle="Issues"
                headerIcon={<RefreshButton />}
                headerFactTitle="Issues in Sprint"
                headerFactValue={issues.length}
            >
                <Tabs
                    value={this.state.selectedTab}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="List" value="list" />
                    <Tab label="Agile Board" value="board" />
                </Tabs>
                {this.state.selectedTab === 'list' &&
                    <IssuesTable
                        filteredIssues={issues}
                        pagination={false}
                    />
                }
                {this.state.selectedTab === 'board' &&
                    <AgileBoard />
                }
            </CustomCard>
        );
    }
}

Issues.propTypes = {
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.sprintsView.issues,
});

export default connect(mapState, null)(Issues);

