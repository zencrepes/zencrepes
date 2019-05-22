import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgLabels, cfgSources, cfgIssues, cfgMilestones } from '../../../Minimongo.js';

class Staging extends Component {
    constructor (props) {
        super(props);
        this.verifErrors = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setVerifFlag, verifFlag, loading } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (verifFlag === true && prevProps.verifFlag === false && loading === false) {
            setVerifFlag(false);
            this.load();
        }
    };

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    clearUnchanged = (action, labels, newName, newDescription, newColor) => {
        if (action === 'delete' || action === 'create') {
            return labels;
        } else {
            return labels.filter((lbl) => {
                if (lbl.name === newName && lbl.description === newDescription && lbl.color === newColor) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    };

    load = async () => {
        const {
            setLoading,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            setLoadingSuccessMsg,
            setLoadingSuccess,
            setStageFlag,
            issues,
            setVerifiedIssues,
            insVerifiedIssues,
            log,
            onSuccess,
        } = this.props;

        //First, clear out all labels that are not changing
        if (issues.length > 0) {
            setLoading(true);
            setLoadingModal(false);
            setVerifiedIssues([]);
            this.verifErrors = 0;
            setLoadingMsg('About to verify data from ' + issues.length + ' issues');
            setLoadingMsgAlt('');
            await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading
            for (let issue of issues) {
                let issueError = false;
                log.info(issue);
                if (this.props.loading === true) {
                    //First part is to massage the data and match the actual GitHub data.

                    //1- Verify repo
                    const repo = cfgSources.findOne({'org.login': new RegExp("^" + issue.org + "$", "i"), 'name': new RegExp("^" + issue.repo + "$", "i")});
                    if (repo === undefined) {
                        insVerifiedIssues({
                            ...issue,
                            create: {
                                title: issue.title
                            },
                            error: true,
                            errorMsg: 'Unable to find the Repository (' + issue.repo + ') or Organization (' + issue.org + ')',
                        });
                        this.verifErrors++;
                        issueError = true;
                    }

                    //2- Verify labels
                    let foundLabels = [];
                    if (!issueError && issue.labels.length > 2 && issue.labels !== 'null') {
                        const issueLabels = issue.labels.split(',');
                        for (let label of issueLabels) {
                            const checkLabel = label.trim();

                            // Look for label in repo
                            const foundLabel = cfgLabels.findOne({'name': checkLabel, 'org.login': new RegExp("^" + issue.org + "$", "i"), 'repo.name': new RegExp("^" + issue.repo + "$", "i")});
                            if (!issueError && foundLabel === undefined) {
                                insVerifiedIssues({
                                    ...issue,
                                    create: {
                                        repo: repo,
                                        title: issue.title
                                    },
                                    error: true,
                                    errorMsg: 'Unable to find label: ' + checkLabel + ' in Repository: ' + issue.repo,
                                });
                                this.verifErrors++;
                                issueError = true;
                            } else if (!issueError) {
                                foundLabels.push(foundLabel);
                            }
                        }
                    }

                    //3- Verify assignees
                    let foundAssignees = [];
                    if (!issueError && issue.assignees.length > 2 && issue.assignees !== 'null') {
                        const issueAssignees = issue.assignees.split(',');
                        for (let assignee of issueAssignees) {
                            const checkAssignee = assignee.trim();

                            // Look for label in repo
                            //{"assignees.edges":{"$elemMatch":{"node.login":{"$in":["pgerthoffert"]}}}}
                            const foundAssignee = cfgIssues.findOne({'assignees.edges':{$elemMatch:{'node.login':{$in:[new RegExp("^" + checkAssignee + "$", "i")]}}}, 'org.login': new RegExp("^" + issue.org + "$", "i"), 'repo.name': new RegExp("^" + issue.repo + "$", "i")});
                            if (!issueError && foundAssignee === undefined) {
                                insVerifiedIssues({
                                    ...issue,
                                    create: {
                                        repo: repo,
                                        title: issue.title
                                    },
                                    error: true,
                                    errorMsg: 'Unable to find assignee: ' + checkAssignee + ' in Repository: ' + issue.repo + ' at least one issue need to be assigned to this individual',
                                });
                                this.verifErrors++;
                                issueError = true;
                            } else if (!issueError) {
                                const currentAssignee = foundAssignee.assignees.edges.filter(n => n.node.login.toLowerCase() === checkAssignee.toLowerCase()).map(n => n.node);
                                if (currentAssignee.length === 1) {
                                    foundAssignees.push(currentAssignee[0]);
                                } else {
                                    insVerifiedIssues({
                                        ...issue,
                                        create: {
                                            repo: repo,
                                            title: issue.title
                                        },
                                        error: true,
                                        errorMsg: 'Error with assignee: ' + checkAssignee + ' in Repository: ' + issue.repo,
                                    });
                                    this.verifErrors++;
                                    issueError = true;
                                }
                            }
                        }
                    }

                    //4- Verify milestone
                    let foundMilestone = undefined;
                    if (!issueError && issue.milestone.length > 2 && issue.assignees !== 'null') {
                        foundMilestone = cfgMilestones.findOne({'title': new RegExp("^" + issue.milestone + "$", "i"), 'org.login': new RegExp("^" + issue.org + "$", "i"), 'repo.name': new RegExp("^" + issue.repo + "$", "i")});
                        if (foundMilestone === undefined) {
                            insVerifiedIssues({
                                ...issue,
                                create: {
                                    title: issue.title
                                },
                                error: true,
                                errorMsg: 'Unable to find the milestone: ' + issue.milestone + ' in repository: ' + issue.repo,
                            });
                            this.verifErrors++;
                            issueError = true;
                        }
                    }

                    //5- Verify duplicate
                    let duplicateIssue = undefined;
                    if (!issueError && issue.duplicate.length > 2) {
                        const duplicateIssueNb = parseInt(issue.duplicate.replace('#', ''));
                        duplicateIssue = cfgIssues.findOne({'number': duplicateIssueNb, 'repo.org.login': new RegExp("^" + issue.org + "$", "i"), 'repo.name': new RegExp("^" + issue.repo + "$", "i")});
                        if (duplicateIssue === undefined) {
                            insVerifiedIssues({
                                ...issue,
                                create: {
                                    title: issue.title
                                },
                                error: true,
                                errorMsg: 'Unable to find issue ' + issue.duplicate + ' in the repo',
                            });
                            this.verifErrors++;
                            issueError = true;
                        }
                    }

                    //6- Verify title exists
                    if (!issueError && issue.title.length < 2 && duplicateIssue === undefined) {
                        insVerifiedIssues({
                            ...issue,
                            create: {
                                title: issue.title
                            },
                            error: true,
                            errorMsg: 'Issue title is a mandatory field',
                        });
                        this.verifErrors++;
                        issueError = true;
                    }

                    if (issueError === false) {
                        // If issue is a duplicate of an exiting issue, we first initialize it with the source issue data
                        let createIssue = {
                            org: repo.org,
                            repo: repo,
                        };
                        if (duplicateIssue !== undefined) {
                            createIssue['title'] = duplicateIssue.title;
                            if (duplicateIssue.body !== undefined) {
                                createIssue['body'] = duplicateIssue.body;
                            }
                            if (duplicateIssue.labels.totalCount > 0 && duplicateIssue.labels.edges.length > 0) {
                                createIssue['labels'] = duplicateIssue.labels.edges.map(label => label.node);
                            }
                            if (duplicateIssue.assignees.totalCount > 0 && duplicateIssue.assignees.edges.length > 0) {
                                createIssue['assignees'] = duplicateIssue.assignees.edges.map(assignee => assignee.node);
                            }
                            if (duplicateIssue.milestone !== null) {
                                createIssue['milestone'] = duplicateIssue.milestone;
                            }
                        }
                        if (issue.title.length > 1) {
                            createIssue['title'] = issue.title;
                        }
                        if (issue.body.length > 1 && issue.body !== 'null') {
                            createIssue['body'] = issue.body;
                        }
                        if (issue.body === 'null' && createIssue['body'] !== undefined) {
                            delete createIssue['body'];
                        }
                        if (foundLabels.length > 0) {
                            createIssue['labels'] = foundLabels;
                        }
                        if (foundAssignees.length > 0) {
                            createIssue['assignees'] = foundAssignees;
                        }
                        if (foundMilestone !== undefined) {
                            createIssue['milestone'] = foundMilestone;
                        }

                        insVerifiedIssues({
                            ...issue,
                            create: createIssue,
                            error: false,
                        });
                    }
                }
            }

            setLoadingSuccessMsg('Staging completed with ' + this.verifErrors + ' error(s)');
            setLoadingSuccess(true);
            setLoading(false);
            onSuccess();
        } else {
            setStageFlag(false);
        }
    };

    render() {
        return null;
    }
}

Staging.propTypes = {
    verifFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    action: PropTypes.string,
    issues: PropTypes.array.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setVerifiedIssues: PropTypes.func.isRequired,
    insVerifiedIssues: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,

    log: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,

    onSuccess: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingMsg: PropTypes.func.isRequired,
    setLoadingMsgAlt: PropTypes.func.isRequired,
    setLoadingModal: PropTypes.func.isRequired,
    setLoadingSuccessMsg: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifFlag: state.issuesCreate.verifFlag,
    action: state.issuesCreate.action,

    issues: state.issuesCreate.issues,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.issuesCreate.setVerifFlag,
    setStageFlag: dispatch.issuesCreate.setStageFlag,
    setVerifiedIssues: dispatch.issuesCreate.setVerifiedIssues,
    insVerifiedIssues: dispatch.issuesCreate.insVerifiedIssues,

    updateChip: dispatch.chip.updateChip,
    setLoading: dispatch.loading.setLoading,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));