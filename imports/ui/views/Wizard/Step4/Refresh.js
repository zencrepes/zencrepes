import React, { Component } from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from 'mdi-react/RefreshIcon';

class Refresh extends Component {
    constructor(props) {
        super(props);
    }

    loadIssues = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    cancelLoad = () => {
        const { setLoading } = this.props;
        setLoading(false);
    };

    render() {
        return (
            <Tooltip title="Refresh issues">
                <IconButton aria-label="Refresh" onClick={this.loadIssues}>
                    <RefreshIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    }
}

Refresh.propTypes = {
    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,

    setLoading: dispatch.loading.setLoading,
});

export default connect(null, mapDispatch)(Refresh);