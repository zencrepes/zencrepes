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
};

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

const calculateAverageVelocity = (array, indexValue) => {
    return array
        .map(values => values[indexValue])
        .reduce((accumulator, currentValue, currentIndex, array) => {
            accumulator += currentValue;
            if (currentIndex === array.length-1) {
                return accumulator/array.length;
            } else {
                return accumulator
            }
        });
};

const initArrays = (firstDay, lastDay) => {
//    console.log('initArrays');
    let emptyDays = [];
    let emptyWeeks = [];
    let currentDate = firstDay;
    while(currentDate < lastDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            emptyDays[currentDate.toJSON().slice(0, 10)] = {date: currentDate.toJSON(), createdCount: 0, closedCount: 0, createdPoints: 0, closedPoints:0};
        }

        let currentWeekYear = currentDate.getFullYear()*100 + getWeekYear(currentDate);
        if(typeof emptyWeeks[currentWeekYear] === 'undefined') {
            emptyWeeks[currentWeekYear] = {weekStart: currentDate.toJSON(), createdCount: 0, closedCount: 0, createdPoints: 0, closedPoints:0};
        }
    }
    return {emptyDays, emptyWeeks};
};

const populateArrays = (countDays, countWeeks, issues) => {
//    console.log('populateArrays');
    issues.forEach((issue) => {
        // Populate daily stats array
        // Ensures the day exists in the array (i.e. not Sunday or Friday).
        // If an issue has been created or closed during this interval, it is being discarded.
        if (countDays[issue.createdAt.slice(0, 10)] !== undefined) {
            countDays[issue.createdAt.slice(0, 10)]['createdCount']++;
            if (issue.closedAt !== null) {
                if (countDays[issue.closedAt.slice(0, 10)] !== undefined) {
                    countDays[issue.closedAt.slice(0, 10)]['closedCount']++;
                }
            }
        }

        // Populate weekly stats array
        createdDate = formatDate(formatDate(issue.createdAt));
        createdWeek = createdDate.getFullYear()*100 + getWeekYear(createdDate);
        countWeeks[createdWeek]['createdCount']++;

        if (issue.closedAt !== null) {
            closedDate = formatDate(formatDate(issue.closedAt));
            closedWeek = closedDate.getFullYear()*100 + getWeekYear(closedDate);
            countWeeks[createdWeek]['closedCount']++;
        }
    });
    return {countDays, countWeeks};
};

const populateTicketsPerDay = (days) => {
//    console.log('populateTicketsPerDay');
    let ticketsPerDay = Object.values(days);
    let startIdx = 0;
    ticketsPerDay.map(function(value, idx) {
        if (idx <=20) {startIdx = 0;}
        else {startIdx = idx - 20;}
        if (idx !== 0) {
            let currentWindowIssues = ticketsPerDay.slice(startIdx, idx); // This limits the window or velocity calculation to 20 days (4 weeks).
            ticketsPerDay[idx]['velocityCreatedCount'] = calculateAverageVelocity(currentWindowIssues, "createdCount");
            ticketsPerDay[idx]['velocityClosedCount'] = calculateAverageVelocity(currentWindowIssues, "closedCount");
            ticketsPerDay[idx]['velocityCreatedPoints'] = calculateAverageVelocity(currentWindowIssues, "createdPoints");
            ticketsPerDay[idx]['velocityClosedPoints'] = calculateAverageVelocity(currentWindowIssues, "closedPoints");
        }
    });
    return ticketsPerDay;
};

const populateTicketsPerWeek = (weeks, issues, mongoFilter) => {
//    console.log('populateTicketsPerWeek');
    let completionVelocities = [];
    let ticketsPerWeek = Object.values(weeks);
    ticketsPerWeek.map(function(value, idx) {
        if (idx <=4) {startIdx = 0;}
        else {startIdx = idx - 4;}
        if (idx !== 0) {
            let currentWindowIssues = ticketsPerWeek.slice(startIdx, idx);
            ticketsPerWeek[idx]['velocityCreatedCount'] = calculateAverageVelocity(currentWindowIssues, "createdCount");
            ticketsPerWeek[idx]['velocityClosedCount'] = calculateAverageVelocity(currentWindowIssues, "closedCount");
            ticketsPerWeek[idx]['velocityCreatedPoints'] = calculateAverageVelocity(currentWindowIssues, "createdPoints");
            ticketsPerWeek[idx]['velocityClosedPoints'] = calculateAverageVelocity(currentWindowIssues, "closedPoints");
        }
        if (idx == ticketsPerWeek.length-1) {
            //This is the last date of the sprint, calculate velocity on various timeframes
            let mongoState = null;

            if (mongoFilter['state'] !== undefined) {let mongoState = mongoFilter['state']; delete mongoFilter['state'];}
            mongoFilter['state'] = 'CLOSED';
            let totalClosedIssues = issues.find({state:'CLOSED'}).count();
            mongoFilter['state'] = 'OPEN';
            let totalOpenIssues = issues.find({state:'OPEN'}).count();
            mongoFilter['state'] = 'OPEN';
            delete mongoFilter['state'];
            if (mongoState !== null) {mongoFilter['state'] = mongoState;};


            let currentCompletion = { // All Time
                'range': 'all',
                'velocityClosedCount': calculateAverageVelocity(ticketsPerWeek, "closedCount"),
                'velocityClosedPoints': calculateAverageVelocity(ticketsPerWeek, "closedPoints")
            }
            currentCompletion['effortCountDays'] = Math.round(totalOpenIssues / currentCompletion['velocityClosedCount'],0);
            completionVelocities.push(currentCompletion);

            if (idx >= 4) { // 4 weeks
                let currentWindowIssues = ticketsPerWeek.slice(idx-4, idx);
                let currentCompletion = {
                    'range': '4w',
                    'velocityClosedCount': calculateAverageVelocity(currentWindowIssues, "closedCount"),
                    'velocityClosedPoints': calculateAverageVelocity(currentWindowIssues, "closedPoints")
                }
                currentCompletion['effortCountDays'] = Math.round(totalOpenIssues / currentCompletion['velocityClosedCount'],0);
                completionVelocities.push(currentCompletion);
            }
            if (idx >= 8) { // 8 weeks
                let currentWindowIssues = ticketsPerWeek.slice(idx-8, idx);
                let currentCompletion = {
                    'range': '8w',
                    'velocityClosedCount': calculateAverageVelocity(currentWindowIssues, "closedCount"),
                    'velocityClosedPoints': calculateAverageVelocity(currentWindowIssues, "closedPoints")
                }
                currentCompletion['effortCountDays'] = Math.round(totalOpenIssues / currentCompletion['velocityClosedCount'],0);
                completionVelocities.push(currentCompletion);
            }
            if (idx >= 12) { // 12 weeks
                let currentWindowIssues = ticketsPerWeek.slice(idx-12, idx);
                let currentCompletion = {
                    'range': '12w',
                    'velocityClosedCount': calculateAverageVelocity(currentWindowIssues, "closedCount"),
                    'velocityClosedPoints': calculateAverageVelocity(currentWindowIssues, "closedPoints")
                }
                currentCompletion['effortCountDays'] = Math.round(totalOpenIssues / currentCompletion['velocityClosedCount'],0);
                completionVelocities.push(currentCompletion);
            }
        }
    });
    return {ticketsPerWeek, completionVelocities};
}



export default {
    state: {
        loadFlag: false,
        loading: false,
        firstDay: null,
        lastDay: null,
        ticketsPerDay: [],
        ticketsPerWeek: [],
        velocity: [],
        mongoFilter: {},
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setFirstDay(state, payload) {return { ...state, firstDay: payload };},
        setLastDay(state, payload) {return { ...state, lastDay: payload };},
        setTicketsPerDay(state, payload) {return { ...state, ticketsPerDay: payload };},
        setTicketsPerWeek(state, payload) {return { ...state, ticketsPerWeek: payload };},
        setVelocity(state, payload) {return { ...state, velocity: payload };},
        setMongoFilter(state, payload) {return { ...state, mongoFilter: payload };},
    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Init state');
            console.log('Velocity Mongo Filter: ' + rootState.velocity.mongoFilter);
            console.log(cfgIssues.find(rootState.velocity.mongoFilter).fetch());
            this.setLoading(true);
            let firstDay = getFirstDay(rootState.velocity.mongoFilter);
            this.setFirstDay(firstDay);
            let lastDay = getLastDay(rootState.velocity.mongoFilter);
            this.setLastDay(lastDay);

            console.log("First Day: " + firstDay.toDateString() + " - Last Day: " + lastDay.toDateString());

            let {emptyDays, emptyWeeks} = initArrays(firstDay, lastDay); // Build an object of all days and weeks between two dates
            let {countDays, countWeeks} = populateArrays(emptyDays, emptyWeeks, cfgIssues.find(rootState.velocity.mongoFilter).fetch()); // Populate the object with count of days and weeks

            let ticketsPerDay = populateTicketsPerDay(countDays);
            this.setTicketsPerDay(Object.values(ticketsPerDay));

            let {ticketsPerWeek, completionVelocities} = populateTicketsPerWeek(countWeeks, cfgIssues, rootState.velocity.mongoFilter);
            this.setTicketsPerWeek(Object.values(ticketsPerWeek));
            this.setVelocity(Object.values(completionVelocities));

            console.log('---');
            console.log(ticketsPerDay);
            console.log(ticketsPerWeek);
            console.log(completionVelocities);
            console.log('---');
            this.setLoading(false);

        }
    }
};