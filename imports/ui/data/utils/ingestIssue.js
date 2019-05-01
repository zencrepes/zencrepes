import { Meteor } from 'meteor/meteor';

/*
*
* ingestIssue() Ingest an individual issue into the minimongo collection
*
* Arguments:
* - issues: Array of issues
*/
import getIssuesStats from "./getIssuesStats.js";

const ingestIssue = async (cfgIssues, issueNode, repoNode, orgNode) => {
    let issueObj = JSON.parse(JSON.stringify(issueNode)); //TODO - Replace this with something better to copy object ?
    issueObj['repo'] = repoNode;
    issueObj['org'] = orgNode;
    issueObj['stats'] = getIssuesStats(issueNode.createdAt, issueNode.updatedAt, issueNode.closedAt);
    issueObj['refreshed'] = true;
    issueObj['points'] = null;
    issueObj['boardState'] = null;

    //The data version module is used to identify when the data model has changed and it is necessary to clear the cache.
    // For now only doing this for issues
    issueObj['data_version'] = Meteor.settings.public.data_version;

    if (issueObj.labels !== undefined) {
        //Get points from labels
        // Regex to test: SP:[.\d]
        let pointsExp = RegExp('SP:[.\\d]');
        //let pointsLabelExp = RegExp('loe:(?<name>.+)');
        let boardExp = RegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
        for (var currentLabel of issueObj.labels.edges) {
            if (pointsExp.test(currentLabel.node.name)) {
                let points = parseInt(currentLabel.node.name.replace('SP:', ''));
                issueObj['points'] = points;
            }
            else if (pointsExp.test(currentLabel.node.description)) {
                let points = parseInt(currentLabel.node.description.replace('SP:', ''));
                issueObj['points'] = points;
            } else if (Meteor.settings.public.labels.effort !== undefined && Meteor.settings.public.labels.effort[currentLabel.node.name] !== undefined && Number.isInteger(Meteor.settings.public.labels.effort[currentLabel.node.name])) {
                // Interesting edge case, if the label is actually named "constructor"
                // Added this check: Number.isInteger(Meteor.settings.public.labels.effort[currentLabel.node.name])
                issueObj['points'] = parseInt(Meteor.settings.public.labels.effort[currentLabel.node.name]);
                /*
                if (Meteor.settings.public.labels.effort !== undefined) {
                    const pointsLabel = pointsLabelExp.exec(currentLabel.node.name);
                    const efforts = Meteor.settings.public.labels.effort;
                    if (efforts[pointsLabel.groups.name] !== undefined) {
                        issueObj['points'] = efforts[pointsLabel.groups.name];
                    }
                }
                */
            }
            if (boardExp.test(currentLabel.node.description)) {
                const boardLabel = boardExp.exec(currentLabel.node.description);
                issueObj['boardState'] = {
                    name: boardLabel.groups.name,
                    priority: boardLabel.groups.priority,
                    label: currentLabel.node,
                };
            }
        }
    }
    await cfgIssues.remove({'id': issueObj.id});
    await cfgIssues.upsert({
        id: issueObj.id
    }, {
        $set: issueObj
    });
    return issueObj;
}
export default ingestIssue;