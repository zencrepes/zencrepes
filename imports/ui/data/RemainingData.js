import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";

class RemainingData extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, loadFlag, setLoadFlag, initStates} = this.props;

        if (loadFlag && loading === false) {
            console.log('RemainingData - componentDidUpdate - Start loading');
            setLoadFlag(false);
            initStates();
        }
    }

    render() {
        return null;
    }
}

RemainingData.propTypes = {

};

const mapState = state => ({
    loading: state.remaining.loading,
    loadFlag: state.remaining.loadFlag,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.remaining.setLoadFlag,
    initStates: dispatch.remaining.initStates,

});

export default connect(mapState, mapDispatch)(RemainingData);

