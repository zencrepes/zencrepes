function calculateQueryIncrement(recordsInCollection, totalCount) {
    let queryIncrement = 30;
    if (totalCount == recordsInCollection) {queryIncrement = 0}
    else if (totalCount - recordsInCollection <= 30) {queryIncrement = totalCount - recordsInCollection;}
    return queryIncrement
}
export default calculateQueryIncrement;
