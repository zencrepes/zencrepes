import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Accounts } from 'meteor/accounts-base';

import { init } from "@rematch/core";
import { Provider } from "react-redux";
//import * as models from "../imports/ui/services/models.js";

import * as models from "../imports/ui/services/models/index.js";

import App from '../imports/ui/App.js';

import { localCfgIssues } from '../imports/ui/data/Minimongo.js';
import { localCfgSources } from '../imports/ui/data/Minimongo.js';
import { localCfgQueries } from '../imports/ui/data/Minimongo.js';
import { localCfgLabels } from '../imports/ui/data/Minimongo.js';

// generate Redux store
const store = init({
    models
});

//TODO - To be removed, for debugging
window.store = store;

Meteor.startup(() => {

    // Reload minimongo data from local storage
    localCfgSources.refresh(true, () => {store.dispatch.startup.setLoadedSources(true);});
    localCfgIssues.refresh(true, () => {store.dispatch.startup.setLoadedIssues(true);});
    localCfgQueries.refresh(true, () => {store.dispatch.startup.setLoadedQueries(true);});
    localCfgLabels.refresh(true, () => {store.dispatch.startup.setLoadedLabels(true);});

    render(
        <Provider store={store}>
            <App />
        </Provider>
        , document.getElementById('render-target')
    );

});
