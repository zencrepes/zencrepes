function calculateQueryIncrement(recordsInCollection, totalCount) {
    var queryIncrement = 100;
    if (totalCount == recordsInCollection) {queryIncrement = 0}
    else if (totalCount - recordsInCollection <= 100) {queryIncrement = totalCount - recordsInCollection;}

    console.log("Records in collection: " + recordsInCollection);
    console.log("Total Count: " + totalCount);
    console.log("Increment: " + queryIncrement);
    return queryIncrement
}
export default calculateQueryIncrement;
