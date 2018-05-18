import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";

class FetchIssues extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('FectchIssues - Initialized');
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextProps.loadIssues === false) {
            console.log('FectchIssues - shouldComponentUpdate: FALSE');
            return false;
        } else {
            console.log('FectchIssues - shouldComponentUpdate: TRUE');
            return true;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('FectchIssues - componentDidUpdate');
        const { setLoadIssues, setIssuesLoading} = this.props;
        setLoadIssues(false);

        // Logic to load Issues
        setIssuesLoading(true);

    }

    render() {
        return null;
    }
}

FetchIssues.propTypes = {

};

const mapState = state => ({
    loadIssues: state.github.loadIssues,

});

const mapDispatch = dispatch => ({
    setLoadIssues: dispatch.github.setLoadIssues,
    setIssuesLoading: dispatch.github.setIssuesLoading,

});

export default connect(mapState, mapDispatch)(FetchIssues);
