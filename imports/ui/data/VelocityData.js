import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";

class VelocityData extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, loadFlag, setLoadFlag, initStates} = this.props;

        if (loadFlag && loading === false) {
            console.log('Velocity - componentDidUpdate - Start loading');
            setLoadFlag(false);
            initStates();
        }
    }

    render() {
        return null;
    }
}

VelocityData.propTypes = {

};

const mapState = state => ({
    loading: state.velocity.loading,
    loadFlag: state.velocity.loadFlag,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.velocity.setLoadFlag,
    initStates: dispatch.velocity.initStates,

});

export default connect(mapState, mapDispatch)(VelocityData);

