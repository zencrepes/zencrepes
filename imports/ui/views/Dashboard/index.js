import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import wizardViewStyle from "../../assets/jss/thatapp/views/wizard.jsx";

import Sidebar from './Sidebar.js';

import PropTypes from "prop-types";

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, activeStep, steps } = this.props;
        return (
            <Sidebar />
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(wizardViewStyle)(Dashboard)));
