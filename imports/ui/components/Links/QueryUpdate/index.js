import { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

class QueryUpdate extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { updateQueryPath, updateQuery } = this.props;
        this.props.history.push({
            pathname: updateQueryPath,
            search: '?q=' + encodeURIComponent(JSON.stringify(updateQuery)),
            state: { detail: updateQuery }
        });
    }

    render() {
        return null;
    }
}

QueryUpdate.propTypes = {
    updateQueryPath: PropTypes.string.isRequired,
    updateQuery: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

const mapState = state => ({
    updateQueryPath: state.global.updateQueryPath,
    updateQuery: state.global.updateQuery,
});

export default connect(mapState, null)(withRouter(QueryUpdate));
