import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgProjects } from "../../Minimongo.js";

import GET_GITHUB_SINGLE_MILESTONE from '../../../../graphql/getSingleProject.graphql';

import GitHubApi from '@octokit/rest';
import PropTypes from 'prop-types';

class Data extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });
    }

    shouldComponentUpdate(nextProps) {
        const { loadFlag } = this.props;
        if (loadFlag !== nextProps.loadFlag) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag, loading } = this.props;
        if (loadFlag && loading === false) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    updateProject = async (project, result) => {
        const {
            client,
            setChipRemaining,
            log,
        } = this.props;
        setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
        let data = {};
        try {
            data = await client.query({
                query: GET_GITHUB_SINGLE_MILESTONE,
                variables: {
                    org_name: project.org.login,
                    repo_name: project.repo.name,
                    project_number: result.data.number
                },
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            });
        }
        catch (error) {
            log.info(error);
        }
        log.info(data);
        if (data.data !== null && data.data !== undefined) {
            const projectObj = {
                ...data.data.repository.project,
                repo: project.repo,
                org: project.org,
            };
            log.info(projectObj);
            await cfgProjects.upsert({
                id: projectObj.id
            }, {
                $set: projectObj
            });
        }
    };

    load = async () => {
        const {
            setChipRemaining,
            projects,
            setLoading,
            setLoadingSuccess,
            setLoadingSuccessMsg,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            action,
            newTitle,
            newDueOn,
            newDescription,
            log,
            onSuccess,
        } = this.props;

        setLoadingModal(true);
        setLoadingMsgAlt('');
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadingSuccess(false);

        log.info(projects);
        for (let project of projects) {
            log.info(project);
            let result = false;
            if (action === 'create') {
                setLoadingMsg('Creating Project ' + project.title + ' in ' + project.org.login + '/' + project.repo.name);
                //To simplify implementation, for now creating is limited to the minimum required fields.
                let createPayload = {
                    owner: project.org.login,
                    repo: project.repo.name,
                    title: newTitle,
                };
                if (newDescription !== null) {
                    createPayload = {
                        ...createPayload,
                        description: newDescription
                    };
                }
                if (newDueOn !== null) {
                    createPayload = {
                        ...createPayload,
                        due_on: newDueOn
                    };
                }
                log.info(createPayload);
                try {
                    result = await this.octokit.issues.createProject(createPayload);
                }
                catch (error) {
                    log.info(error);
                }
                if (result !== false) {
                    await this.updateProject(project, result);

                    /*
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    let data = {};
                    try {
                        data = await client.query({
                            query: GET_GITHUB_SINGLE_MILESTONE,
                            variables: {
                                org_name: project.org.login,
                                repo_name: project.repo.name,
                                project_number: result.data.number
                            },
                            fetchPolicy: 'no-cache',
                            errorPolicy: 'ignore',
                        });
                    }
                    catch (error) {
                        log.info(error);
                    }
                    log.info(data);
                    if (data.data !== null) {
                        const projectObj = {
                            ...data.data.repository.project,
                            repo: project.repo,
                            org: project.org,
                        };
                        log.info(projectObj);
                        await cfgProjects.upsert({
                            id: projectObj.id
                        }, {
                            $set: projectObj
                        });
                    }
                    */
                }
            } else if (action === 'close') {
                setLoadingMsg('Closing Project ' + project.title + ' in ' + project.org.login + '/' + project.repo.name);
                try {
                    result = await this.octokit.issues.updateProject({
                        owner: project.org.login,
                        repo: project.repo.name,
                        number: project.number,
                        state: 'closed',
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    await this.updateProject(project, result);
                    /*
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    //incrementLoadedCount(1);
                    await cfgProjects.update({
                        id: project.id
                    }, {
                        $set: {state: 'CLOSED'}
                    });
                    */
                }
            } else if (action === 'open') {
                setLoadingMsg('Opening Project ' + project.title + ' in ' + project.org.login + '/' + project.repo.name);
                try {
                    result = await this.octokit.issues.updateProject({
                        owner: project.org.login,
                        repo: project.repo.name,
                        number: project.number,
                        state: 'open',
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    await this.updateProject(project, result);

                    /*
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    //incrementLoadedCount(1);
                    await cfgProjects.update({
                        id: project.id
                    }, {
                        $set: {state: 'OPEN'}
                    });
                    */
                }
            } else if (action === 'delete') {
                setLoadingMsg('Deleting Project ' + project.title + ' in ' + project.org.login + '/' + project.repo.name);
                try {
                    result = await this.octokit.issues.deleteProject({
                        owner: project.org.login,
                        repo: project.repo.name,
                        number: project.number,
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    cfgProjects.remove({id: project.id});
                }
            } else if (action === 'update') {
                setLoadingMsg('Updating Project ' + project.title + ' in ' + project.org.login + '/' + project.repo.name);
                let updateProject = false;
                let updatePayload = {
                    owner: project.org.login,
                    repo: project.repo.name,
                    number: project.number,
                };
                if (newDescription !== project.description) {
                    let updateDescription = newDescription;
                    if (newDescription === null) {
                        updateDescription = '';
                    }
                    updatePayload = {
                        ...updatePayload,
                        description: updateDescription
                    };
                    updateProject = true;
                }
                if (newTitle !== project.title) {
                    updatePayload = {
                        ...updatePayload,
                        title: newTitle
                    };
                    updateProject = true;
                }
                if (newDueOn !== project.dueOn) {
                    updatePayload = {
                        ...updatePayload,
                        due_on: newDueOn
                    };
                    updateProject = true;
                }
                log.info(updatePayload);
                if (updateProject === false ) {
                    log.info('Nothing to be changed, not sending a request to GitHub');
                } else {
                    try {
                        result = await this.octokit.issues.updateProject(updatePayload);
                    }
                    catch (error) {
                        log.info(error);
                    }
                    if (result !== false) {
                        await this.updateProject(project, result);
                        /*
                        setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                        let data = {};
                        try {
                            data = await client.query({
                                query: GET_GITHUB_SINGLE_MILESTONE,
                                variables: {
                                    org_name: project.org.login,
                                    repo_name: project.repo.name,
                                    project_number: result.data.number
                                },
                                fetchPolicy: 'no-cache',
                                errorPolicy: 'ignore',
                            });
                        }
                        catch (error) {
                            log.info(error);
                        }
                        log.info(data);
                        if (data.data !== null) {
                            const projectObj = {
                                ...data.data.repository.project,
                                repo: project.repo,
                                org: project.org,
                            };
                            log.info(projectObj);
                            await cfgProjects.upsert({
                                id: projectObj.id
                            }, {
                                $set: projectObj
                            });
                        }
                        */
                    }
                }
            }
        }
        setLoadingSuccessMsg('Update Completed');
        setLoadingSuccess(true);
        setLoading(false);
        onSuccess();
    };

    render() {
        return null;
    }
}

Data.propTypes = {
    loadFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    action: PropTypes.string,
    log: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,

    newTitle: PropTypes.string,
    newState: PropTypes.string,
    newDueOn: PropTypes.string,
    newDescription: PropTypes.string,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingMsg: PropTypes.func.isRequired,
    setLoadingMsgAlt: PropTypes.func.isRequired,
    setLoadingModal: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,
    setLoadingSuccessMsg: PropTypes.func.isRequired,

    updateChip: PropTypes.func.isRequired,
    setChipRemaining: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadFlag: state.projectsEdit.loadFlag,
    action: state.projectsEdit.action,

    projects: state.projectsEdit.projects,

    newTitle: state.projectsEdit.newTitle,
    newState: state.projectsEdit.newState,
    newDueOn: state.projectsEdit.newDueOn,
    newDescription: state.projectsEdit.newDescription,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.projectsEdit.setLoadFlag,

    setLoading: dispatch.loading.setLoading,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(Data));
