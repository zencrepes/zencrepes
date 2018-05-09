import { cfgIssues } from '../../data/Issues.js';

const formatDate = (dateString) => {
    day = new Date(dateString);
    day.setUTCHours(0);
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    return day
}

const getFirstDay = () => {
    let firstDay = formatDate(cfgIssues.findOne({}, { sort: { createdAt: 1 }, reactive: false, transform: null }).createdAt);
    firstDay.setDate(firstDay.getDate() - 1);
    return firstDay
}

const getLastDay = () => {
    let lastDay = formatDate(cfgIssues.findOne({}, { sort: { createdAt: -11 }, reactive: false, transform: null }).createdAt);
    lastDay.setDate(lastDay.getDate() + 1);
    return lastDay
}

export default {
    state: {
        loading: false,
        firstDay: null,
        lastDay: null,


    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setFirstDay(state, payload) {return { ...state, loading: payload };},
        setLastDay(state, payload) {return { ...state, loading: payload };},

    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Init state');
            let firstDay = getFirstDay();
            this.setFirstDay(firstDay);
            let lastDay = getLastDay();
            this.setLastDay(lastDay);

            console.log("First Day: " + firstDay.toDateString() + " - Last Day: " + lastDay.toDateString());

        }
    }
};