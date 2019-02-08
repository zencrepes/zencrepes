import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import General from '../../layouts/General/index.js';

import Repositories from './Repositories/index.js';
import PropTypes from "prop-types";
import {connect} from "react-redux";

import Actions from './Actions/index.js';

/*
function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}
*/
const TabContainer = ( {children} ) => {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
};
TabContainer.propTypes = {
    children: PropTypes.object.isRequired,
};


class Settings extends Component {
    constructor(props) {
        super(props);
        /*
        this.state = {
            value: 0
        };
        */
    }

    componentDidMount() {
        const { initView } = this.props;
        initView();
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
//        const { value } = this.state;
        return (
            <General>
                <Actions />

                <Repositories/>
            </General>
        );
    }
}

Settings.propTypes = {
    initView: PropTypes.func.isRequired,
};

/*
Previous Tabs logic
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Repositories" />
                    <Tab label="Configure Points" />
                    <Tab label="Import Points" />
                </Tabs>
                {value === 0 && <TabContainer><Repositories/></TabContainer>}
                {value === 1 && <TabContainer><StoryPoints /></TabContainer>}
                {value === 2 && <TabContainer><ImportPoints /></TabContainer>}
 */

const mapDispatch = dispatch => ({
    initView: dispatch.settingsView.initView,
});

export default connect(null, mapDispatch)(Settings);