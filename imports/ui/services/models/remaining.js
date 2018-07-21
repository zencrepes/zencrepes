import _ from 'lodash';

import { cfgIssues } from '../../data/Minimongo.js';

import { getFirstDay, getLastDay, initObject, populateObject, populateTicketsPerDay, populateTicketsPerWeek } from '../../utils/velocity/index.js';
import {buildMongoSelector} from "../../utils/mongo/index.js";

/**
 * getPointsForRepo() Return the number of points for a specific repository
 *
 * Arguments:
 * - facet: Current facet being processed
 * - updatedFilters: List of selected filters
 */
const getPointsForRepo = (repoName, filter, cfgIssues) => {
    if (filter['repo.name'] !== undefined) {
        delete filter['repo.name'];
    }
    filter['repo.name'] = {"$in":[repoName]};
    return cfgIssues
        .find(filter)
        .fetch()
        .filter(i => i.points !== null )
        .map(i => i.points)
        .reduce((acc, points) => acc + points, 0);
};

export default {
    state: {
        loadFlag: false,
        loading: false,
        filters: {},
        count: 0,
        points: 0,
        repos: [],
        defaultPoints: true,
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setFilters(state, payload) {return { ...state, filters: payload };},
        setCount(state, payload) {return { ...state, count: payload };},
        setPoints(state, payload) {return { ...state, points: payload };},
        setRepos(state, payload) {return { ...state, repos: payload };},
        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},
    },
    effects: {
        async initStates(payload, rootState) {
            let mongoSelector = buildMongoSelector(rootState.repartition.filters);
            console.log('Repartition Mongo Selector: ' + JSON.stringify(mongoSelector));

            if (mongoSelector['state'] !== undefined) {
                delete mongoSelector['state'];
            }
            let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};

            //console.log(cfgIssues.find(rootState.repartition.mongoFilter).fetch());
            this.setLoading(true);

            this.setCount(cfgIssues.find(openedIssuesFilter).count());

            //console.log('Start Loading');
            let repos = [];
            statesGroup = _.groupBy(cfgIssues.find(openedIssuesFilter).fetch(), 'repo.name');
            Object.keys(statesGroup).forEach(function(key) {
                repos.push({
                    count: statesGroup[key].length,
                    name: key,
                    issues: statesGroup[key],
                    points: getPointsForRepo(key, openedIssuesFilter, cfgIssues)
                });
            });
            console.log(repos);
            this.setRepos(repos);
            this.setPoints(repos.map(r => r.points).reduce((acc, points) => acc + points, 0));

            this.setLoading(false);
        }
    }
};