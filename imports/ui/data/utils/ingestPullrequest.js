import { Meteor } from 'meteor/meteor';

import {reactLocalStorage} from 'reactjs-localstorage';

/*
*
* ingestPullrequest() Ingest an individual pullrequest into the minimongo collection
*
* Arguments:
* - pullrequests: Array of pullrequests
*/
import getPullrequestsStats from "./getPullrequestsStats.js";

const ingestPullrequest = async (cfgPullrequests, pullrequestNode, repoNode, orgNode) => {
    let pullrequestObj = JSON.parse(JSON.stringify(pullrequestNode)); //TODO - Replace this with something better to copy object ?
    pullrequestObj['repo'] = repoNode;
    pullrequestObj['org'] = orgNode;
    pullrequestObj['stats'] = getPullrequestsStats(pullrequestNode.createdAt, pullrequestNode.updatedAt, pullrequestNode.closedAt);
    pullrequestObj['refreshed'] = true;
    pullrequestObj['points'] = null;
    pullrequestObj['boardState'] = null;

    //The data version module is used to identify when the data model has changed and it is necessary to clear the cache.
    // For now only doing this for pullrequests
    pullrequestObj['data_version'] = Meteor.settings.public.data_version;

    // START - This feature (likely temporary), can be used to verify the presence of specific fields in a PR template
    // To use it, simply add an array of strings in a 'feat-prtemplate' in your browser's localStorage
    const prtemplates = JSON.parse(reactLocalStorage.get('feat-prtemplate', "[]"));
    let templateValues = [];
    if (prtemplates.length > 0) {
        templateValues = prtemplates.filter(template => pullrequestNode.body.includes(template)).map((template) => {
            return {
                node: {
                    name: template
                }
            }
        });

    }
    pullrequestObj['template'] = {
        totalCount: templateValues.length,
        totalCountStr: templateValues.length.toString(), // This is a nasty hack to avoid having to change the facets filtering logic :( :( :(
        edges: templateValues,
    };
    // END - Template testing feature

    if (pullrequestObj.labels !== undefined) {
        //Get points from labels
        // Regex to test: SP:[.\d]
        let pointsExp = RegExp('SP:[.\\d]');
        //let pointsLabelExp = RegExp('loe:(?<name>.+)');
        let boardExp = RegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
        for (var currentLabel of pullrequestObj.labels.edges) {
            if (pointsExp.test(currentLabel.node.name)) {
                let points = parseInt(currentLabel.node.name.replace('SP:', ''));
                pullrequestObj['points'] = points;
            } else if (Meteor.settings.public.effort !== undefined && Meteor.settings.public.effort[currentLabel.node.name] !== undefined && Number.isInteger(Meteor.settings.public.effort[currentLabel.node.name])) {
                // Interesting edge case, if the label is actually named "constructor"
                // Added this check: Number.isInteger(Meteor.settings.public.effort[currentLabel.node.name])
                pullrequestObj['points'] = parseInt(Meteor.settings.public.effort[currentLabel.node.name]);
                /*
                if (Meteor.settings.public.effort !== undefined) {
                    const pointsLabel = pointsLabelExp.exec(currentLabel.node.name);
                    const efforts = Meteor.settings.public.effort;
                    if (efforts[pointsLabel.groups.name] !== undefined) {
                        pullrequestObj['points'] = efforts[pointsLabel.groups.name];
                    }
                }
                */
            }
            if (boardExp.test(currentLabel.node.description)) {
                const boardLabel = boardExp.exec(currentLabel.node.description);
                pullrequestObj['boardState'] = {
                    name: boardLabel.groups.name,
                    priority: boardLabel.groups.priority,
                    label: currentLabel.node,
                };
            }
        }
    }
    await cfgPullrequests.remove({'id': pullrequestObj.id});
    await cfgPullrequests.upsert({
        id: pullrequestObj.id
    }, {
        $set: pullrequestObj
    });
    return pullrequestObj;
}
export default ingestPullrequest;