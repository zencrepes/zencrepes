
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

    if (issueObj.labels !== undefined) {
        //Get points from labels
        // Regex to test: SP:[.\d]
        let pointsExp = RegExp('SP:[.\\d]');
        let boardExp = RegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
        for (var currentLabel of issueObj.labels.edges) {
            if (pointsExp.test(currentLabel.node.name)) {
                let points = parseInt(currentLabel.node.name.replace('SP:', ''));
                issueObj['points'] = points;
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