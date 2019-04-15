import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { render } from 'react-dom';
//import { Accounts } from 'meteor/accounts-base';
import { PersistentMinimongo2 }  from 'meteor/frozeman:persistent-minimongo2'

import { init } from "@rematch/core";
import { Provider } from "react-redux";

import * as models from "../imports/ui/services/models/index.js";

import App from '../imports/ui/App.js';

import { cfgIssues } from '../imports/ui/data/Minimongo.js';
import { cfgPullrequests } from '../imports/ui/data/Minimongo.js';
import { cfgSources } from '../imports/ui/data/Minimongo.js';
import { cfgQueries } from '../imports/ui/data/Minimongo.js';
import { cfgLabels } from '../imports/ui/data/Minimongo.js';
import { cfgMilestones } from '../imports/ui/data/Minimongo.js';
import { cfgProjects } from '../imports/ui/data/Minimongo.js';

// generate Redux store
const store = init({
    models
});

//TODO - To be removed, for debugging
window.store = store;


Tracker.autorun(function () {
    if (Meteor.user()) {
        let username = Meteor.user().services.github.username;

        // Reload minimongo data from local storage
        const localCfgSources = new PersistentMinimongo2(cfgSources, 'GAV-Repos-' + username);
        localCfgSources.refresh(true, () => {store.dispatch.startup.setLoadedSources(true);});

        const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues-' + username);
        localCfgIssues.refresh(true, () => {store.dispatch.startup.setLoadedIssues(true);});

        const localCfgPullrequests = new PersistentMinimongo2(cfgPullrequests, 'GAV-Pullrequests-' + username);
        localCfgPullrequests.refresh(true, () => {store.dispatch.startup.setLoadedPullrequests(true);});

        const localCfgQueries = new PersistentMinimongo2(cfgQueries, 'GAV-Queries-' + username);
        localCfgQueries.refresh(true, () => {store.dispatch.startup.setLoadedQueries(true);});

        const localCfgLabels = new PersistentMinimongo2(cfgLabels, 'GAV-Labels-' + username);
        localCfgLabels.refresh(true, () => {store.dispatch.startup.setLoadedLabels(true);});

        const localCfgMilestones = new PersistentMinimongo2(cfgMilestones, 'GAV-Milestones-' + username);
        localCfgMilestones.refresh(true, () => {store.dispatch.startup.setLoadedMilestones(true);});

        const localCfgProjects = new PersistentMinimongo2(cfgProjects, 'GAV-Projects-' + username);
        localCfgProjects.refresh(true, () => {store.dispatch.startup.setLoadedProjects(true);});
    }
});


Meteor.startup(() => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
        , document.getElementById('render-target')
    );

});
