import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Accounts } from 'meteor/accounts-base';

import { init } from "@rematch/core";
import { Provider } from "react-redux";
//import * as models from "../imports/ui/services/models.js";

import * as models from "../imports/ui/services/models/index.js";


import App from '../imports/ui/App.js';

import { localCfgIssues } from '../imports/ui/data/Issues.js';
import { localCfgSources } from '../imports/ui/data/Repositories.js';

// generate Redux store
const store = init({
    models
});

Meteor.startup(() => {
    // TODO - This definitely need to be replaced by a better logic
    // Used to give enough time for minimongo to refresh from local storage before proceeding with app load
    localCfgSources.refresh();
    localCfgIssues.refresh();
    Meteor.setTimeout(() => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
            , document.getElementById('render-target'));
    }, 2000);
});