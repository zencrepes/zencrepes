import { cfgIssues } from '../../data/Issues.js';

const formatDate = (dateString) => {
    day = new Date(dateString);
    day.setUTCHours(0);
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    return day
};

const getWeekYear = (dateObj) => {
    var jan4th = new Date(dateObj.getFullYear(),0,4);
    return Math.ceil((((dateObj - jan4th) / 86400000) + jan4th.getDay()+1)/7);
}

const getFirstDay = (mongoFilter) => {
    let firstDay = formatDate(cfgIssues.findOne(mongoFilter, { sort: { createdAt: 1 }, reactive: false, transform: null }).createdAt);
    firstDay.setDate(firstDay.getDate() - 1);
    return firstDay
};

const getLastDay = (mongoFilter) => {
    let lastDay = formatDate(cfgIssues.findOne(mongoFilter, { sort: { createdAt: -11 }, reactive: false, transform: null }).createdAt);
    lastDay.setDate(lastDay.getDate() + 1);
    return lastDay
};

const initArrays = (firstDay, lastDay) => {
    console.log('initArrays');
    let days = [];
    let weeks = [];
    let currentDate = firstDay;
    while(currentDate < lastDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            days[currentDate.toJSON().slice(0, 10)] = {date: currentDate.toJSON(), createdCount: 0, closedCount: 0, createdPoints: 0, closedPoints:0};
        }

        let currentWeekYear = currentDate.getFullYear()*100 + getWeekYear(currentDate);
        if(typeof weeks[currentWeekYear] === 'undefined') {
            weeks[currentWeekYear] = {weekStart: currentDate.toJSON(), createdCount: 0, closedCount: 0, createdPoints: 0, closedPoints:0};
        }
    }
    return {days, weeks};
};

const populateArrays = (days, weeks, issues) => {
    console.log('populateArrays');
    issues.forEach((issue) => {
        // Populate daily stats array
        // Ensures the day exists in the array (i.e. not Sunday or Friday).
        // If an issue has been created or closed during this interval, it is being discarded.
        if (days[issue.createdAt.slice(0, 10)] !== undefined) {
            days[issue.createdAt.slice(0, 10)]['createdCount']++;
            if (issue.closedAt !== null) {
                if (days[issue.closedAt.slice(0, 10)] !== undefined) {
                    days[issue.closedAt.slice(0, 10)]['closedCount']++;
                }
            }
        }

        // Populate weekly stats array
        createdDate = formatDate(formatDate(issue.createdAt));
        createdWeek = createdDate.getFullYear()*100 + getWeekYear(createdDate);
        weeks[createdWeek]['createdCount']++;

        if (issue.closedAt !== null) {
            closedDate = formatDate(formatDate(issue.closedAt));
            closedWeek = closedDate.getFullYear()*100 + getWeekYear(closedDate);
            weeks[createdWeek]['closedCount']++;
        }
    });
    console.log(days);
    console.log(weeks);
    return {days, weeks};
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
            let firstDay = getFirstDay({});
            this.setFirstDay(firstDay);
            let lastDay = getLastDay({});
            this.setLastDay(lastDay);

            console.log("First Day: " + firstDay.toDateString() + " - Last Day: " + lastDay.toDateString());
            let {days, weeks} = initArrays(firstDay, lastDay);
            console.log('---');
            console.log(days);
            console.log(weeks);
            console.log('---');
            populateArrays(days, weeks, cfgIssues.find({}).fetch());
//            console.log(days);
//            console.log(weeks);
            console.log('---');


        }
    }
};