/*
*
* sortIssues() Return an array of issues sorted by
*
* Arguments:
* - mongoSelector: MongoDb query selector
* - cfgIssues: Minimongo instance
*/
export const sortIssues = (issues) => {

    const highPriority = issues.filter(issue => {
        if (issue.labels.totalCount > 0 && issue.labels.edges.filter(lbl => lbl.node.name === 'Priority: High').length > 0) {
            return true;
        } else {
            return false;
        }
    });

    const mediumPriority = issues.filter(issue => {
        if (issue.labels.totalCount > 0 && issue.labels.edges.filter(lbl => lbl.node.name === 'Priority: Medium').length > 0) {
            return true;
        } else {
            return false;
        }
    });

    const lowPriority = issues.filter(issue => {
        if (issue.labels.totalCount > 0 && issue.labels.edges.filter(lbl => lbl.node.name === 'Priority: Low').length > 0) {
            return true;
        } else {
            return false;
        }
    });

    const noPriority = issues.filter(issue => {
        if (issue.labels.totalCount === 0 || issue.labels.edges.filter(lbl => (lbl.node.name === 'Priority: High' || lbl.node.name === 'Priority: Medium' || lbl.node.name === 'Priority: Low')).length === 0) {
            return true;
        } else {
            return false;
        }
    });

    return [...highPriority, ...mediumPriority, ...lowPriority, ...noPriority];
};
