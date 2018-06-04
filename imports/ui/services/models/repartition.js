import { cfgIssues } from '../../data/Issues.js';

const getAssignees = (issues) => {
    console.log('getAssignees');

    let statesGroup = [];

    let allValues = [];
    issues.forEach((issue) => {
        if (issue['assignees'].totalCount === 0) {
            //console.log('getFacetAggregations - processing: ' + facet.group + ' - Null value: ' + facet.nullName);
            //console.log(allValues);
            let pushObj = {};
            pushObj['login'] = 'UNASSIGNED';
            allValues.push(pushObj);
        } else {
            issue['assignees'].edges.map((nestedValue) => {
                if (nestedValue.node['login'] === null || nestedValue.node['login'] === '' || nestedValue.node['login'] === undefined ) {
                    //console.log({...nestedValue.node, name: nestedValue.node.login});
                    allValues.push({...nestedValue.node, name: nestedValue.node.login});
                } else {
                    allValues.push(nestedValue.node);
                }
            })
        }
    });
    statesGroup = _.groupBy(allValues, 'login');


    // If the key is 'undefined', replace with default facet name
    if (statesGroup['undefined'] !== undefined) {
        statesGroup['UNASSIGNED'] = statesGroup['undefined'];
        delete statesGroup['undefined'];
    }

    let states = [];
    Object.keys(statesGroup).forEach(function(key) {
        states.push({count: statesGroup[key].length, name: key });
    });
    //Return the array sorted by count
    console.log(states);
    return states.sort((a, b) => b.count - a.count);

    //{header: 'Assignees', group: 'assignees', type: 'text', nested: 'login', nullName: 'UNASSIGNED', nullFilter: {'assignees.totalCount': { $eq : 0 }}, data: [] },

};

const openedIssues = (mongoFilter) => {
    let updatedFilter = Object.assign({}, mongoFilter);
    if (updatedFilter['state'] !== undefined) {delete updatedFilter['state'];}
    updatedFilter['state'] = 'OPEN';
    return updatedFilter;
};

export default {
    state: {
        loadFlag: false,
        loading: false,
        mongoFilter: {},
        repartition: [],
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setMongoFilter(state, payload) {return { ...state, mongoFilter: payload };},
        setRepartition(state, payload) {return { ...state, repartition: payload };},

    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Repartition Mongo Filter: ' + JSON.stringify(rootState.repartition.mongoFilter));
            console.log(cfgIssues.find(rootState.repartition.mongoFilter).fetch());
            this.setLoading(true);

            console.log('Start Loading');

            //Build an aggregate by assignee
            this.setRepartition(getAssignees(cfgIssues.find(openedIssues(rootState.repartition.mongoFilter)).fetch()));

            this.setLoading(false);
        }
    }
};