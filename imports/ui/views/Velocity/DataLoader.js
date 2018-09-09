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
            this.loadVelocity();
            this.loadRepartition();
        }
    }

    componentDidMount() {
        this.loadVelocity();
        this.loadRepartition();
    }

    loadVelocity() {
        const { queryFilters, velocityFilters, velocityLoading, velocityInitStates, velocitySetFilters, velocityInitFlag} = this.props;
        loadReduxData(queryFilters, velocityFilters, velocitySetFilters, velocityLoading, velocityInitStates, velocityInitFlag);
    }

    loadRepartition() {
        const { queryFilters, repartitionFilters, repartitionLoading, repartitionInitStates, repartitionSetFilters, repartitionInitFlag} = this.props;
        loadReduxData(queryFilters, repartitionFilters, repartitionSetFilters, repartitionLoading, repartitionInitStates, repartitionInitFlag);
    }

    render() {
        return null;
    }
}

DataLoader.propTypes = {

};

const mapState = state => ({
    queryFilters: state.queries.filters,

    velocityLoading: state.velocity.loading,
    velocityInitFlag: state.velocity.initFlag,
    velocityFilters: state.velocity.filters,

    repartitionLoading: state.repartition.loading,
    repartitionInitFlag: state.repartition.initFlag,
    repartitionFilters: state.repartition.filters,
});

const mapDispatch = dispatch => ({
    velocityInitStates: dispatch.velocity.initStates,
    velocitySetFilters: dispatch.velocity.setFilters,

    repartitionInitStates: dispatch.repartition.initStates,
    repartitionSetFilters: dispatch.repartition.setFilters,
});

export default connect(mapState, mapDispatch)(DataLoader);

