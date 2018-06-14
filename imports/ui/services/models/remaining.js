import _ from 'lodash';

import { cfgIssues } from '../../data/Issues.js';

import { getFirstDay, getLastDay, initObject, populateObject, populateTicketsPerDay, populateTicketsPerWeek } from '../../utils/velocity/index.js';
import {buildMongoSelector} from "../../utils/mongo/index.js";



export default {
    state: {
        loadFlag: false,
        loading: false,
        filter: {},
        count: 0,
        points: 0,
        repos: [],
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setFilter(state, payload) {return { ...state, filter: payload };},
        setCount(state, payload) {return { ...state, count: payload };},
        setPoints(state, payload) {return { ...state, points: payload };},
        setRepos(state, payload) {return { ...state, repos: payload };},

    },
    effects: {
        async initStates(payload, rootState) {
            let mongoSelector = buildMongoSelector(rootState.repartition.filter);
            console.log('Repartition Mongo Selector: ' + JSON.stringify(mongoSelector));

            if (mongoSelector['state'] !== undefined) {
                delete mongoSelector['state'];
            }
            let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};

            //console.log(cfgIssues.find(rootState.repartition.mongoFilter).fetch());
            this.setLoading(true);

            //console.log('Start Loading');
            let repos = [];
            statesGroup = _.groupBy(cfgIssues.find(openedIssuesFilter).fetch(), 'repo.name');
            Object.keys(statesGroup).forEach(function(key) {
                repos.push({
                    count: statesGroup[key].length,
                    name: key,
                    issues: statesGroup[key],
                    points: 0
                });
            });
            this.setRepos(repos);

            this.setLoading(false);
        }
    }
};