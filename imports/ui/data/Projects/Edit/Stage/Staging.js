import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_MILESTONE from '../../../../../graphql/getSingleProject.graphql';

import { cfgProjects, cfgSources } from '../../../Minimongo.js';

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

    clearUnchanged = (action, projects, newTitle, newState, newDueOn) => {
        if (action === 'delete' || action === 'create') {
            return projects;
        } else {
            return projects.filter((mls) => {
                if (mls.title === newTitle && mls.state === newState && mls.dueOn === newDueOn) {
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
            setProjects,
            projects,
            setVerifiedProjects,
            insVerifiedProjects,
            client,
            action,
            log,
            newTitle,
            newState,
            newDueOn,
            onSuccess,
        } = this.props;

        //First, clear out all projects that are not changing
        const projectsToUpdate = this.clearUnchanged(action, projects, newTitle, newState, newDueOn);
        setProjects(projectsToUpdate);

        if (projectsToUpdate.length >0 ) {
            setLoading(true);
            setLoadingModal(false);
            setVerifiedProjects([]);
            this.verifErrors = 0;
            setLoadingMsg('About pull data from ' + projectsToUpdate.length + ' projects');
            setLoadingMsgAlt('');
            await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading
            for (const [idx, project] of projectsToUpdate.entries()) {
                log.info(project);
                if (this.props.loading === true) {
                    // First, verify if a project with this title already exists in the repo
                    if (cfgProjects.find({'title': newTitle, 'repo.id' : project.repo.id}).count() > 0) {
                        insVerifiedProjects({
                            ...project,
                            error: true,
                            errorMsg: 'This project already exists in this repository. Please pick a different title.',
                        });
                        this.verifErrors++;
                    } else if (action !== 'create') {
                        let baseMsg = (idx + 1) + '/' + projects.length + ' - Fetching project: ' + project.org.login + '/' + project.repo.name + '#' + project.number;
                        setLoadingMsg(baseMsg);
                        log.info(baseMsg);
                        let data = {};
                        try {
                            data = await client.query({
                                query: GET_GITHUB_SINGLE_MILESTONE,
                                variables: {
                                    org_name: project.org.login,
                                    repo_name: project.repo.name,
                                    project_number: project.number
                                },
                                fetchPolicy: 'no-cache',
                                errorPolicy: 'ignore',
                            });
                        }
                        catch (error) {
                            log.warn(error);
                        }
                        log.info(data);
                        if (data.data !== null && data.data !== undefined) {
                            if (data.data !== undefined) {
                                this.props.updateChip(data.data.rateLimit);
                            }
                            if (data.data === undefined) {
                                // The repository doesn't exist anymore on GitHub.
                                insVerifiedProjects({
                                    id: project.id,
                                    error: true,
                                    errorMsg: 'Unable to communicate with GitHub, please check your network connectivity',
                                });
                                this.verifErrors++;
                            }
                            else if (data.data.repository === null) {
                                // The repository doesn't exist anymore on GitHub.
                                insVerifiedProjects({
                                    id: project.id,
                                    error: true,
                                    errorMsg: 'This repository doesn\'t exist in GitHub currently. Was it deleted ?',
                                });
                                await cfgProjects.remove({'id': project.id});
                                await cfgSources.update({id: project.repo.id}, {active: false}, {multi: false});
                                this.verifErrors++;
                            }
                            else if (data.data.repository.viewerPermission !== 'ADMIN' && data.data.repository.viewerPermission !== 'WRITE') {
                                // The repository doesn't exist anymore on GitHub.
                                insVerifiedProjects({
                                    id: project.id,
                                    error: true,
                                    errorMsg: 'Your missing write permission on this repository. Your permission: ' + data.data.repository.viewerPermission,
                                });
                                this.verifErrors++;
                            }
                            else if (data.data.repository.project === null && action !== 'create') {
                                insVerifiedProjects({
                                    id: project.id,
                                    error: true,
                                    errorMsg: 'This project doesn\'t exist in GitHub currently. Was it deleted ?',
                                });
                                await cfgProjects.remove({'id': project.id});
                                this.verifErrors++;
                            }
                            else if (data.data.repository.project.id !== project.id && action !== 'create') {
                                insVerifiedProjects({
                                    id: project.id,
                                    error: true,
                                    errorMsg: 'There seems to be an ID mismatch between your local copy and GitHub, please clear all your Projects and reload. This can happen if a project was created with the same number than a previously deleted project.',
                                });
                                this.verifErrors++;
                            }
                            else {
                                if (data.data.repository.project.updatedAt === project.updatedAt && data.data.repository.project.issues.totalCount === project.issues.totalCount) {
                                    insVerifiedProjects({
                                        ...data.data.repository.project,
                                        error: false,
                                    })
                                }
                                else if (data.data.repository.project.updatedAt !== project.updatedAt) {
                                    insVerifiedProjects({
                                        ...data.data.repository.project,
                                        error: true,
                                        errorMsg: 'This project has been modified in GitHub since it was last loaded locally. updatedAt dates are different',
                                    })

                                } else if (data.data.repository.project.issues.totalCount !== project.issues.totalCount) {
                                    insVerifiedProjects({
                                        ...data.data.repository.project,
                                        error: true,
                                        errorMsg: 'This project has been modified in GitHub since it was last loaded locally. issues Counts are are different',
                                    })
                                }
                                await cfgProjects.upsert({
                                    id: data.data.repository.project.id
                                }, {
                                    $set: data.data.repository.project
                                });
                            }
                        }
                    } else {
                        insVerifiedProjects({
                            ...project,
                            error: false,
                        });
                    }
                }
            }
            if (action === 'refresh') {
                setLoadingSuccessMsg('Completed with ' + this.verifErrors + ' update(s)');
            } else {
                setLoadingSuccessMsg('Completed with ' + this.verifErrors + ' error(s)');
            }
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
    newTitle: PropTypes.string,
    newState: PropTypes.string,
    newDueOn: PropTypes.string,
    projects: PropTypes.array.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setProjects: PropTypes.func.isRequired,
    setVerifiedProjects: PropTypes.func.isRequired,
    insVerifiedProjects: PropTypes.func.isRequired,
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
    verifFlag: state.projectsEdit.verifFlag,
    action: state.projectsEdit.action,
    newTitle: state.projectsEdit.newName,
    newState: state.projectsEdit.newColor,
    newDueOn: state.projectsEdit.newDescription,

    projects: state.projectsEdit.projects,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.projectsEdit.setVerifFlag,
    setStageFlag: dispatch.projectsEdit.setStageFlag,
    setProjects: dispatch.projectsEdit.setProjects,
    setVerifiedProjects: dispatch.projectsEdit.setVerifiedProjects,
    insVerifiedProjects: dispatch.projectsEdit.insVerifiedProjects,

    updateChip: dispatch.chip.updateChip,
    setLoading: dispatch.loading.setLoading,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));