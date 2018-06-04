import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";

class RepartitionData extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, loadFlag, setLoadFlag, initStates} = this.props;

        if (loadFlag && loading === false) {
            console.log('RepartitionData - componentDidUpdate - Start loading');
            setLoadFlag(false);
            initStates();
        }
    }

    render() {
        return null;
    }
}

RepartitionData.propTypes = {

};

const mapState = state => ({
    loading: state.repartition.loading,
    loadFlag: state.repartition.loadFlag,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.repartition.setLoadFlag,
    initStates: dispatch.repartition.initStates,

});

export default connect(mapState, mapDispatch)(RepartitionData);

