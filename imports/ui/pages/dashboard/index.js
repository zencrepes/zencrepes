import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import Button from 'material-ui/Button';
import AppMenu from '../../components/AppMenu/index.js';
import LeftDrawer from '../../components/LeftDrawer/index.js'

class Dashboard extends Component {
    render() {
        return (
            <div>
                <AppMenu />
                <LeftDrawer />
                Dashboard
            </div>
        );
    }
}
export default Dashboard;