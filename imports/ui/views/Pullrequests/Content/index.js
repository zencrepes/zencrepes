import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Summary from './Summary/index.js';
import PullrequestsList from './PullrequestsList/index.js';

class PullrequestsContent extends Component {
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
                    0: <Summary />,
                    1: <PullrequestsList />,
                }[selectedTab]}
            </React.Fragment>
        );
    }
}

PullrequestsContent.propTypes = {
    selectedTab: PropTypes.number.isRequired,
};

const mapState = state => ({
    selectedTab: state.pullrequestsView.selectedTab,
});

export default connect(mapState, null)(PullrequestsContent);
