//Get various stats around issue timing
function getIssuesStats(createdAt, updatedAt, closedAt) {
    //This issue has been opened for X days
    let openedDuring = null;
    if (createdAt !== null && closedAt !== null) {
        openedDuring = Math.round((new Date(closedAt) - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }

    //This issue was first opened X days ago
    let createdSince = null;
    if (createdAt !== null) {
        createdSince = Math.round((new Date() - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was closed X days ago
    let closedSince = null;
    if (closedAt !== null) {
        closedSince = Math.round((new Date() - new Date(closedAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was last updated X days ago
    let updatedSince = null;
    if (updatedAt !== null) {
        updatedSince = Math.round((new Date() - new Date(updatedAt)) / (1000 * 3600 * 24), 0);
    }
    let stats = {
        openedDuring: openedDuring,
        createdSince: createdSince,
        closedSince: closedSince,
        updatedSince: updatedSince,
    };
    return stats;
}
export default getIssuesStats;