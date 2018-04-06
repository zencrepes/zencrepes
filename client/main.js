import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../imports/ui/services/models.js";

import App from '../imports/ui/App.js';

// generate Redux store
const store = init({
    models
});

Meteor.startup(() => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    , document.getElementById('render-target'));
});