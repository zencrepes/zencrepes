import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Stats from './Stats/index.js';
import RepositoriesList from './RepositoriesList/index.js';

class RepositoriesContent extends Component {
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
                    'list': <RepositoriesList />,
                }[selectedTab]}
            </React.Fragment>
        );
    }
}

RepositoriesContent.propTypes = {
    selectedTab: PropTypes.string.isRequired,
};

const mapState = state => ({
    selectedTab: state.repositoriesView.selectedTab,
});

export default connect(mapState, null)(RepositoriesContent);
