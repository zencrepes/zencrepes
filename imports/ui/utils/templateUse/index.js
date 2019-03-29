/*
*
* refreshVelocity() Takes a mongo selector (finder) and Initialize an object containing indices for all days between two dates
*
* Arguments:
* - mongoSelector: MongoDb query selector
* - cfgPullrequests: Minimongo instance
*/
export const refreshTemplateUsage = (mongoSelector, cfgPullrequests) => {
    let firstDay = getFirstDay(mongoSelector, cfgPullrequests);
//    let lastDay = getLastDay(closedPullrequestsFilter, cfgPullrequests);
    //let lastDay = new Date();
    let lastDay = getLastDay(mongoSelector, cfgPullrequests);


    let dataObject = initObject(firstDay, lastDay); // Build an object of all days and weeks between two dates
    dataObject = populateObject(dataObject, cfgPullrequests.find(mongoSelector).fetch()); // Populate the object with count of days and weeks
    return dataObject;
};

/*
*
* formatDate() Take out hours, minutes and seconds from a date string and return date object
*
* Arguments:
* - dateString: Date string
*/
//TODO - To be removed, has been moved to shared.js
export const formatDate = (dateString) => {
    let day = new Date(dateString);
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
* - cfgPullrequests: Minimongo instance
*/
export const getFirstDay = (mongoFilter, cfgPullrequests) => {
    if (cfgPullrequests.find(mongoFilter).count() > 0) {
        let firstDay = formatDate(cfgPullrequests.findOne(mongoFilter, { sort: { createdAt: 1 }, reactive: false, transform: null }).createdAt);
        firstDay.setDate(firstDay.getDate() - 1);
        return firstDay
    } else {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        //return new Date();
        return date;
    }
};

/*
*
* getLastDay() Return the first day from a minimongo dataset
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgPullrequests: Minimongo instance
*/
export const getLastDay = (mongoFilter, cfgPullrequests) => {
    if (cfgPullrequests.find(mongoFilter).count() > 0) {
        let firstDay = formatDate(cfgPullrequests.findOne(mongoFilter, { sort: { createdAt: -1 }, reactive: false, transform: null }).createdAt);
        firstDay.setDate(firstDay.getDate() - 1);
        return firstDay
    } else {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        //return new Date();
        return date;
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
    let initObject = {weeks: {}};
    let currentDate = firstDay;
    while(currentDate < lastDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        let currentMonthDay = currentDate.getDate();
        if (currentDate.getDay() !== 0) {currentMonthDay = currentMonthDay - currentDate.getDay();}
        let currentWeekYear = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentMonthDay );

        if(typeof initObject['weeks'][currentWeekYear] === 'undefined') {
            //console.log(currentWeekYear);
            initObject['weeks'][currentWeekYear] = {
                //weekStart: currentDate.toJSON(),
                weekStart: currentWeekYear.toJSON(),
                PRs: [],
                totalPRCount: 0,
                templates: {},
                templateCount: {},
            };
        }
    }
    initObject['templateDict'] = [];
    return initObject;
};

/*
*
* populateArrays() Initialize an object containing indices for all days between two dates
*
* Arguments:
* - firstDay: first day in the object
* - lastDay: last day in the object
*/
export const populateObject = (dataObject, pullrequests) => {
    for (let pullrequest of pullrequests) {
        let createdDate = new Date(pullrequest.createdAt);
        let createdMonthDay = createdDate.getDate();
        if (createdDate.getDay() !== 0) {createdMonthDay = createdMonthDay - createdDate.getDay();}
        let createdWeek = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdMonthDay );
        if (dataObject['weeks'][createdWeek] !== undefined) {
            dataObject['weeks'][createdWeek].PRs.push(pullrequest);
            dataObject['weeks'][createdWeek]['totalPRCount'] = dataObject['weeks'][createdWeek]['totalPRCount'] + 1;
            for (let prtemplate of pullrequest.template.edges) {
                if (dataObject['templateDict'].includes(prtemplate.node.name) === false ) {
                    dataObject['templateDict'].push(prtemplate.node.name);
                }
                if (dataObject['weeks'][createdWeek]['templates'][prtemplate.node.name] === undefined) {
                    dataObject['weeks'][createdWeek]['templates'][prtemplate.node.name] = {name: prtemplate.node.name, count: 1};
                } else {
                    dataObject['weeks'][createdWeek]['templates'][prtemplate.node.name]['count'] = dataObject['weeks'][createdWeek]['templates'][prtemplate.node.name]['count'] + 1;
                }
            }
            if (dataObject['weeks'][createdWeek]['templateCount'][pullrequest.template.totalCountStr] === undefined) {
                dataObject['weeks'][createdWeek]['templateCount'][pullrequest.template.totalCountStr] = {name: pullrequest.template.totalCountStr, count: 1};
            } else {
                dataObject['weeks'][createdWeek]['templateCount'][pullrequest.template.totalCountStr]['count'] = dataObject['weeks'][createdWeek]['templateCount'][pullrequest.template.totalCountStr]['count'] + 1;
            }
        }
    }

    dataObject['weeks'] = Object.values(dataObject['weeks']);

    return dataObject;
};

