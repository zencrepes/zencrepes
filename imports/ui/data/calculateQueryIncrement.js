function calculateQueryIncrement(recordsInCollection, totalCount) {
    let queryIncrement = 100;
    if (totalCount == recordsInCollection) {queryIncrement = 0}
    else if (totalCount - recordsInCollection <= 100) {queryIncrement = totalCount - recordsInCollection;}
    return queryIncrement
}
export default calculateQueryIncrement;
