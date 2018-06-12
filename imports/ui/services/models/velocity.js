import { cfgIssues } from '../../data/Issues.js';

import { getFirstDay, getLastDay, initObject, populateObject, populateTicketsPerDay, populateTicketsPerWeek } from '../../utils/velocity/index.js';
import {buildMongoSelector} from "../../utils/mongo/index.js";

export default {
    state: {
        loadFlag: false,
        loading: false,
        velocity: {},
        filter: {}
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setVelocity(state, payload) {return { ...state, velocity: payload };},
        setFilter(state, payload) {return { ...state, filter: payload };},
    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Init state');
            let mongoSelector = buildMongoSelector(rootState.velocity.filter);
            this.setLoading(true);

            if (mongoSelector['state'] !== undefined) {
                delete mongoSelector['state'];
            }
            let closedIssuesFilter = {...mongoSelector, ...{'state':{$in:['CLOSED']}}};
            let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};


            let firstDay = getFirstDay(closedIssuesFilter, cfgIssues);
            let lastDay = getLastDay(closedIssuesFilter, cfgIssues);

            let dataObject = initObject(firstDay, lastDay); // Build an object of all days and weeks between two dates
            dataObject = populateObject(dataObject, cfgIssues.find(closedIssuesFilter).fetch()); // Populate the object with count of days and weeks
            dataObject = populateTicketsPerDay(dataObject);
            dataObject = populateTicketsPerWeek(dataObject, cfgIssues.find(openedIssuesFilter).count());

            console.log(closedIssuesFilter);
            console.log(dataObject);

            this.setVelocity(dataObject);
            this.setLoading(false);
        }
    }
};