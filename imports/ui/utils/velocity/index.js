/*
*
* formatDate() Take out hours, minutes and seconds from a date string and return date object
*
* Arguments:
* - dateString: Date string
*/
export const formatDate = (dateString) => {
    day = new Date(dateString);
    day.setUTCHours(0);
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    return day
};

/*
*
* getWeekYear() Get the current week from a date object
*
* Arguments:
* - dateObj: Date object
*/
export const getWeekYear = (dateObj) => {
    var jan4th = new Date(dateObj.getFullYear(),0,4);
    return Math.ceil((((dateObj - jan4th) / 86400000) + jan4th.getDay()+1)/7);
};

/*
*
* getFirstDay() Return the first day from a minimongo dataset
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgIssues: Minimongo instance
*/
export const getFirstDay = (mongoFilter, cfgIssues) => {
    if (cfgIssues.find(mongoFilter).count() > 0) {
        let firstDay = formatDate(cfgIssues.findOne(mongoFilter, { sort: { createdAt: 1 }, reactive: false, transform: null }).createdAt);
        firstDay.setDate(firstDay.getDate() - 1);
        return firstDay
    } else {
        return new Date() - 1;
    }
};

/*
*
* getLastDay() Return the last day from a minimongo dataset
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgIssues: Minimongo instance
*/
export const getLastDay = (mongoFilter, cfgIssues) => {
    if (cfgIssues.find(mongoFilter).count() > 0) {
        let lastDay = formatDate(cfgIssues.findOne(mongoFilter, {
            sort: {createdAt: -1},
            reactive: false,
            transform: null
        }).createdAt);
        lastDay.setDate(lastDay.getDate() + 1);
        return lastDay
    } else {
        return new Date() + 1;
    }
};

/*
*
* initObject() Initialize an object containing indices for all days between two dates
*
* Arguments:
* - firstDay: first day in the object
* - lastDay: last day in the object
*/
export const initObject = (firstDay, lastDay) => {
    let initObject = {days: {}, weeks: {}};
    let currentDate = firstDay;
    while(currentDate < lastDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            initObject['days'][currentDate.toJSON().slice(0, 10)] = {
                date: currentDate.toJSON(),
                issues: {count: 0},
                points: {count: 0},
                closedCount: 0,
                closedPoints:0
            };
        }

        //let currentWeekYear = currentDate.getFullYear()*100 + getWeekYear(currentDate);
        //http://lifelongprogrammer.blogspot.com/2014/06/js-get-first-last-day-of-current-week-month.html
        // /let d = currentDate.getDay();
        let currentWeekYear = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (currentDate.getDay() == 0?0:7)-currentDate.getDay() );
        if(typeof initObject['weeks'][currentWeekYear] === 'undefined') {
            //console.log(currentWeekYear);
            initObject['weeks'][currentWeekYear] = {
                //weekStart: currentDate.toJSON(),
                weekStart: currentWeekYear.toJSON(),
                issues: {count: 0},
                points: {count: 0},
                closedCount: 0,
                closedPoints:0
            };
        }
    }
    return initObject;
};

/*
*
* calculateAverageVelocity()
*
* Arguments:
* - array:
* - indexValue:
*/
const calculateAverageVelocity = (array, indexValue) => {
    return array
        .map(values => values[indexValue]['count'])
        .reduce((accumulator, currentValue, currentIndex, array) => {
            accumulator += currentValue;
            if (currentIndex === array.length-1) {
                return accumulator/array.length;
            } else {
                return accumulator
            }
        });
};

/*
*
* populateArrays() Initialize an object containing indices for all days between two dates
*
* Arguments:
* - firstDay: first day in the object
* - lastDay: last day in the object
*/
export const populateObject = (dataObject, issues) => {
    issues.forEach((issue) => {
        if (dataObject['days'][issue.closedAt.slice(0, 10)] !== undefined) {
            dataObject['days'][issue.closedAt.slice(0, 10)]['issues']['count']++;
        }

        if (issue.closedAt !== null) {
            let closedDate = new Date(issue.closedAt);
            let closedWeek = new Date(closedDate.getFullYear(), closedDate.getMonth(), closedDate.getDate() + (closedDate.getDay() == 0?0:7)-closedDate.getDay() );
            //closedDate = formatDate(issue.closedAt);
            //closedWeek = closedDate.getFullYear()*100 + getWeekYear(closedDate);
            console.log(closedWeek);
            if (dataObject['weeks'][closedWeek] !== undefined) {
                dataObject['weeks'][closedWeek]['issues']['count']++;
            }
        }
    });
   //console.log(dataObject);
    return dataObject;
};

/*
*
* populateTicketsPerDay()
*
* Arguments:
* - days:
*/
export const populateTicketsPerDay = (dataObject) => {
    let ticketsPerDay = Object.values(dataObject['days']);
    let startIdx = 0;
    ticketsPerDay.map(function(value, idx) {
        if (idx <=20) {startIdx = 0;}
        else {startIdx = idx - 20;}
        if (idx !== 0) {
            let currentWindowIssues = ticketsPerDay.slice(startIdx, idx); // This limits the window or velocity calculation to 20 days (4 weeks).
            ticketsPerDay[idx]['issues']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'issues');
            ticketsPerDay[idx]['points']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'points');
        }
    });
    dataObject['days'] = ticketsPerDay;
    return dataObject;
};

/*
*
* populateTicketsPerDay()
*
* Arguments:
* - days:
*/
export const populateTicketsPerWeek = (dataObject, remaingIssuesCount) => {
//    console.log('populateTicketsPerWeek');
    let completionVelocities = [];
    let ticketsPerWeek = Object.values(dataObject['weeks']);
    ticketsPerWeek.map(function(value, idx) {
        if (idx <=4) {startIdx = 0;}
        else {startIdx = idx - 4;}
        if (idx !== 0) {
            let currentWindowIssues = ticketsPerWeek.slice(startIdx, idx);
            ticketsPerWeek[idx]['issues']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'issues');
            ticketsPerWeek[idx]['points']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'points');
        }
        if (idx == ticketsPerWeek.length-1) {
            //This is the last date of the sprint, calculate velocity on various timeframes
            let currentCompletion = { // All Time
                'range': 'all',
                'issues': {'velocity': calculateAverageVelocity(ticketsPerWeek, 'issues')},
                'points': {'velocity': calculateAverageVelocity(ticketsPerWeek, 'points')},
            }
            currentCompletion['issues']['effort'] = Math.round(remaingIssuesCount / currentCompletion['issues']['velocity'],3);
            completionVelocities.push(currentCompletion);

            if (idx >= 4) { // 4 weeks
                let currentWindowIssues = ticketsPerWeek.slice(idx-4, idx);
                let currentCompletion = {
                    'range': '4w',
                    'issues': {'velocity': calculateAverageVelocity(currentWindowIssues, 'issues')},
                    'points': {'velocity': calculateAverageVelocity(currentWindowIssues, 'points')},
                }
                currentCompletion['issues']['effort'] = Math.round(remaingIssuesCount / currentCompletion['issues']['velocity'],3);
                completionVelocities.push(currentCompletion);
            }
            if (idx >= 8) { // 8 weeks
                let currentWindowIssues = ticketsPerWeek.slice(idx-8, idx);
                let currentCompletion = {
                    'range': '8w',
                    'issues': {'velocity': calculateAverageVelocity(currentWindowIssues, 'issues')},
                    'points': {'velocity': calculateAverageVelocity(currentWindowIssues, 'points')},
                }
                currentCompletion['issues']['effort'] = Math.round(remaingIssuesCount / currentCompletion['issues']['velocity'],3);
                completionVelocities.push(currentCompletion);
            }
            if (idx >= 12) { // 12 weeks
                let currentWindowIssues = ticketsPerWeek.slice(idx-12, idx);
                let currentCompletion = {
                    'range': '12w',
                    'issues': {'velocity': calculateAverageVelocity(currentWindowIssues, 'issues')},
                    'points': {'velocity': calculateAverageVelocity(currentWindowIssues, 'points')},
                }
                currentCompletion['issues']['effort'] = Math.round(remaingIssuesCount / currentCompletion['issues']['velocity'],3);
                completionVelocities.push(currentCompletion);
            }
        }
    });
    dataObject['weeks'] = ticketsPerWeek;
    dataObject['velocity'] = completionVelocities;
    return dataObject;
//    return {ticketsPerWeek, completionVelocities};
};