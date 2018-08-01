import _ from 'lodash';

import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";

/*
Watches for a change in data filters, and apply this change back to the queries redux store
 */
class SyncFilters extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    updateFilters() {
        const { dataFilters, queriesFilters, setFilters} = this.props;
        if (!_.isEqual(dataFilters, queriesFilters)) {
            setFilters(dataFilters);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('SyncFilters - componentDidUpdate');
        this.updateFilters();
    }

    componentDidMount() {
        console.log('SyncFilters - componentDidMount');
        this.updateFilters();
    }

    render() {
        return null;
    }
}

SyncFilters.propTypes = {

};

const mapState = state => ({
    dataFilters: state.data.filters,
    queriesFilters: state.queries.filters,
});

const mapDispatch = dispatch => ({
    setFilters: dispatch.queries.setFilters,

});

export default connect(mapState, mapDispatch)(SyncFilters);

