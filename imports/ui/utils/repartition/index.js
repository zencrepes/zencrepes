export const getAssigneesRepartition = (issues) => {
    console.log('getAssignees');

    let statesGroup = [];

    let allValues = [];
    issues.forEach((issue) => {
        if (issue['assignees'].totalCount === 0) {
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
        states.push({count: statesGroup[key].length, login: key });
    });
    //Return the array sorted by count
    return states.sort((a, b) => b.count - a.count);
};