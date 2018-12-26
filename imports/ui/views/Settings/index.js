import React, { Component } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


import General from '../../layouts/General/index.js';

import Repositories from './Repositories/index.js';
import StoryPoints from './StoryPoints/index.js';
import ImportPoints from './ImportPoints/index.js';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { value } = this.state;

        return (
            <General>
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
            </General>
        );
    }
}

Settings.propTypes = {

};

export default Settings;
