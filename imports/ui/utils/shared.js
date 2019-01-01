/*
*
* formatDate() Take out hours, minutes and seconds from a date string and return date object
*
* Arguments:
* - dateString: Date string
*/
export const formatDate = (dateString) => {
    let day = new Date(dateString);
    day.setUTCHours(0);
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    return day
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
            sort: {closedAt: -1},
            reactive: false,
            transform: null
        }).closedAt);
        lastDay.setDate(lastDay.getDate() + 1);
        return lastDay
    } else {
        return new Date() + 1;
    }
};

/*
 *
 * populateOpen()
 *
 * Arguments:
 * - dataObject: Object to modify
 * - openIssues: Array of opened issues
 */
export const populateOpen = (dataObject, openIssues) => {
    let remainingPoints = openIssues
        .filter(issue => issue.points !== null)
        .map(issue => issue.points)
        .reduce((acc, points) => acc + points, 0);
    dataObject['open'] = {'issues': openIssues, 'points': remainingPoints};
    return dataObject;
};