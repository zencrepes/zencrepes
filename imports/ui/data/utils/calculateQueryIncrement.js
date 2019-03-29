import {reactLocalStorage} from 'reactjs-localstorage';

function calculateQueryIncrement(recordsInCollection, totalCount) {
    var queryIncrement = parseInt(reactLocalStorage.get('dataFetchNodes', 100));
    if (totalCount == recordsInCollection) {queryIncrement = 0}
    else if (totalCount - recordsInCollection <= parseInt(reactLocalStorage.get('dataFetchNodes', 100))) {queryIncrement = totalCount - recordsInCollection;}

    //console.log("Records in collection: " + recordsInCollection);
    //console.log("Total Count: " + totalCount);
    //console.log("Increment: " + queryIncrement);
    // Always return 10 as minimum increment
//    if (queryIncrement < 10) {queryIncrement = 10;}
    return queryIncrement
}
export default calculateQueryIncrement;
