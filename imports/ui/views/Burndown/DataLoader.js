import _ from 'lodash';
import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";

/*
 loadReduxData()
  - filters: Source filters to be applied to the redux store
  - setFilters: dispatch function to send the filter to
 */
const loadReduxData = (newFilters, oldFilters, setFilters, loading, initStates, initFlag) => {
    if (loading === false) {
        if (!_.isEqual(newFilters, oldFilters) || initFlag === false) {
            setFilters(newFilters);
            initStates();
        }
    }
};

class DataLoader extends Component {
    constructor (props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { queryFilters } = this.props;
        if (!_.isEqual(prevProps.queryFilters, queryFilters)) {
            this.loadBurndown();
        }
    }

    componentDidMount() {
        this.loadBurndown();
    }

    loadBurndown() {
        const { queryFilters, burndownFilters, burndownLoading, burndownInitStates, burndownSetFilters, burndownInitFlag} = this.props;
        loadReduxData(queryFilters, burndownFilters, burndownSetFilters, burndownLoading, burndownInitStates, burndownInitFlag);
    }

    render() {
        return null;
    }
}

DataLoader.propTypes = {

};

const mapState = state => ({
    queryFilters: state.queries.filters,

    burndownLoading: state.burndown.loading,
    burndownInitFlag: state.burndown.initFlag,
    burndownFilters: state.burndown.filters,
});

const mapDispatch = dispatch => ({
    burndownInitStates: dispatch.burndown.initStates,
    burndownSetFilters: dispatch.burndown.setFilters,
});

export default connect(mapState, mapDispatch)(DataLoader);

