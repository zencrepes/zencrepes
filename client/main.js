import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Accounts } from 'meteor/accounts-base';

import { init } from "@rematch/core";
import { Provider } from "react-redux";
//import * as models from "../imports/ui/services/models.js";

import * as models from "../imports/ui/services/models/index.js";

import App from '../imports/ui/App.js';

/*
import { localCfgIssues } from '../imports/ui/data/Minimongo.js';
import { localCfgSources } from '../imports/ui/data/Minimongo.js';
import { localCfgQueries } from '../imports/ui/data/Minimongo.js';
import { localCfgLabels } from '../imports/ui/data/Minimongo.js';
*/

import { cfgIssues } from '../imports/ui/data/Minimongo.js';
import { cfgSources } from '../imports/ui/data/Minimongo.js';
import { cfgQueries } from '../imports/ui/data/Minimongo.js';
import { cfgLabels } from '../imports/ui/data/Minimongo.js';

// generate Redux store
const store = init({
    models
});

//TODO - To be removed, for debugging
window.store = store;


Tracker.autorun(function () {
    if (Meteor.user()) {
        // Do something
        console.log(Meteor.user());
        let username = Meteor.user().services.github.username;

        const localCfgSources = new PersistentMinimongo2(cfgSources, 'GAV-Repos-' + username);
        localCfgSources.refresh(true, () => {store.dispatch.startup.setLoadedSources(true);});

        const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues-' + username);
        localCfgIssues.refresh(true, () => {store.dispatch.startup.setLoadedIssues(true);});

        const localCfgQueries = new PersistentMinimongo2(cfgQueries, 'GAV-Queries-' + username);
        localCfgQueries.refresh(true, () => {store.dispatch.startup.setLoadedQueries(true);});

        const localCfgLabels = new PersistentMinimongo2(cfgLabels, 'GAV-Labels-' + username);
        localCfgLabels.refresh(true, () => {store.dispatch.startup.setLoadedLabels(true);});
    }
});


Meteor.startup(() => {
    // Reload minimongo data from local storage
    /*
    localCfgSources.refresh(true, () => {store.dispatch.startup.setLoadedSources(true);});
    localCfgIssues.refresh(true, () => {store.dispatch.startup.setLoadedIssues(true);});
    localCfgQueries.refresh(true, () => {store.dispatch.startup.setLoadedQueries(true);});
    localCfgLabels.refresh(true, () => {store.dispatch.startup.setLoadedLabels(true);});
    */
    render(
        <Provider store={store}>
            <App />
        </Provider>
        , document.getElementById('render-target')
    );

});
