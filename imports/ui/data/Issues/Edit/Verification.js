import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_MILESTONE from '../../../../graphql/getSingleIssue.graphql';

import { cfgIssues } from '../../Minimongo.js';
import getIssuesStats from "../../utils/getIssuesStats";

class Verification extends Component {
    constructor (props) {
        super(props);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { setVerifFlag, verifFlag } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (verifFlag === true && prevProps.verifFlag === false) {
            setVerifFlag(false);
            this.load();
        }
    };

    load = async () => {
        const { setVerifying, issues, setVerifiedIssues, insVerifiedIssues, client, onSuccess, setVerifyingMsg, setVerifySuccess } = this.props;
        setVerifySuccess(false);
        setVerifying(true);
        setVerifiedIssues([]);
        setVerifyingMsg('About pull data from ' + issues.length + ' issues');
//        for (let issue of issues) {
        for (const [idx, issue] of issues.entries()) {
            let baseMsg = (idx+1) + '/' + issues.length + ' - Processing issue: ' + issue.org.login + '/' + issue.repo.name + '#' + issue.number;
            setVerifyingMsg(baseMsg);
            let data = {};
            try {
                data = await client.query({
                    query: GET_GITHUB_SINGLE_MILESTONE,
                    variables: {org_name: issue.org.login, repo_name: issue.repo.name, issue_number: issue.number},
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'ignore',
                });
            }
            catch (error) {
                console.log(error);
            }
            if (data.data !== null) {
                if (data.data.repository.issue.updatedAt === issue.updatedAt) {
                    insVerifiedIssues({
                        ...data.data.repository.issue,
                        updated: false,
                    })
                } else {
                    insVerifiedIssues({
                        ...data.data.repository.issue,
                        updated: true,
                    });
                    let issueObj = JSON.parse(JSON.stringify(data.data.repository.issue)); //TODO - Replace this with something better to copy object
                    if (issueObj.labels !== undefined) {
                        //Get points from labels
                        // Regex to test: SP:[.\d]
                        let pointsExp = RegExp('SP:[.\\d]');
                        for (let [key, currentLabel] of Object.entries(issueObj.labels.edges)) {
                            if (pointsExp.test(currentLabel.node.name)) {
                                let points = parseInt(currentLabel.node.name.replace('SP:', ''));
                                console.log('This issue has ' + points + ' story points');
                                issueObj['points'] = points;
                            }
                        }
                    }
                    await cfgIssues.upsert({
                        id: data.data.repository.issue.id
                    }, {
                        $set: issueObj
                    });
                }
                this.props.updateChip(data.data.rateLimit);
            }
        }
        setVerifying(false);
        setVerifySuccess(true);
        onSuccess();
    };

    render() {
        return null;
    }
}

Verification.propTypes = {

};

const mapState = state => ({
    verifFlag: state.issuesEdit.verifFlag,

    issues: state.issuesEdit.issues,
    onSuccess: state.issuesEdit.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.issuesEdit.setVerifFlag,
    setVerifying: dispatch.issuesEdit.setVerifying,
    setVerifyingMsg: dispatch.issuesEdit.setVerifyingMsg,
    setVerifiedIssues: dispatch.issuesEdit.setVerifiedIssues,
    insVerifiedIssues: dispatch.issuesEdit.insVerifiedIssues,
    setVerifySuccess: dispatch.issuesEdit.setVerifySuccess,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Verification));