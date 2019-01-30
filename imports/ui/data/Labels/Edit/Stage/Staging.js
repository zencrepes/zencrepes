import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_LABEL from '../../../../../graphql/getSingleLabel.graphql';

import { cfgLabels, cfgSources } from '../../../Minimongo.js';

class Staging extends Component {
    constructor (props) {
        super(props);
        this.verifErrors = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setVerifFlag, verifFlag } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (verifFlag === true && prevProps.verifFlag === false) {
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
            setLabels,
            labels,
            setVerifiedLabels,
            insVerifiedLabels,
            client,
            action,
            log,
            newName,
            newDescription,
            newColor,
            onSuccess,
        } = this.props;

        //First, clear out all labels that are not changing
        const labelsToUpdate = this.clearUnchanged(action, labels, newName, newDescription, newColor);
        setLabels(labelsToUpdate);
        if (labelsToUpdate.length > 0) {
            setLoading(true);
            setLoadingModal(false);
            setVerifiedLabels([]);
            this.verifErrors = 0;
            setLoadingMsg('About pull data from ' + labelsToUpdate.length + ' labels');
            setLoadingMsgAlt('');
            await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading
            for (const [idx, label] of labelsToUpdate.entries()) {
                log.info(label);
                if (this.props.loading === true) {
                    let baseMsg = (idx+1) + '/' + labelsToUpdate.length + ' - Verifying label: ' + label.org.login + '/' + label.repo.name + '#' + label.name;
                    let labelName = label.name;
                    if (action === 'create') {labelName = newName;}
                    setLoadingMsg(baseMsg);
                    let data = {};
                    try {
                        data = await client.query({
                            query: GET_GITHUB_SINGLE_LABEL,
                            variables: {
                                org_name: label.org.login,
                                repo_name: label.repo.name,
                                label_name: labelName
                            },
                            fetchPolicy: 'no-cache',
                            errorPolicy: 'ignore',
                        });
                    }
                    catch (error) {
                        log.warn(error);
                    }
                    log.info(data);
                    if (data.data !== null) {
                        if (data.data !== undefined) {
                            this.props.updateChip(data.data.rateLimit);
                        }
                        if (data.data === undefined) {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedLabels({
                                id: label.id,
                                error: true,
                                errorMsg: 'Unable to communicate with GitHub, please check your network connectivity',
                            });
                            this.verifErrors++;
                        }
                        else if (data.data.repository === null) {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedLabels({
                                id: label.id,
                                error: true,
                                errorMsg: 'This repository doesn\'t exist in GitHub currently. Was it deleted ?',
                            });
                            await cfgLabels.remove({'id': label.id});
                            await cfgSources.update({id: label.repo.id}, { active: false }, {multi: false});
                            this.verifErrors++;
                        }
                        else if (data.data.repository.viewerPermission !== 'ADMIN' && data.data.repository.viewerPermission !== 'WRITE') {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedLabels({
                                id: label.id,
                                error: true,
                                errorMsg: 'Your permissions the necessary permissions on this repository. Your permission: ' + data.data.repository.viewerPermission,
                            });
                            this.verifErrors++;
                        }
                        else if (data.data.repository.label === null && action !== 'create') {
                            // The label doesn't exist anymore on GitHub.
                            insVerifiedLabels({
                                id: label.id,
                                error: true,
                                errorMsg: 'This label doesn\'t exist in GitHub currently. Was it deleted ?',
                            });
                            await cfgLabels.remove({'id': label.id});
                            this.verifErrors++;
                        } else if (data.data.repository.label === null && action === 'create') {
                            // The label doesn't exist in the repository, meaning all-clear for creating.
                            insVerifiedLabels({
                                ...label,
                                error: false,
                            });
                        } else if (data.data.repository.label !== null && action === 'create') {
                            insVerifiedLabels({
                                ...label,
                                error: true,
                                errorMsg: 'This label already exists in GitHub. Please rename instead of creating a label.',
                            });
                            this.verifErrors++;
                        } else {
                            if (data.data.repository.label.updatedAt === label.updatedAt && data.data.repository.label.issues.totalCount === label.issues.totalCount) {
                                insVerifiedLabels({
                                    ...data.data.repository.label,
                                    error: false,
                                });
                            } else if (data.data.repository.label.updatedAt !== label.updatedAt) {
                                insVerifiedLabels({
                                    ...data.data.repository.label,
                                    error: true,
                                    errorMsg: 'This label has been modified in GitHub since it was last loaded locally. updatedAt dates are different',
                                });
                                this.verifErrors++;
                            } else if (data.data.repository.label.issues.totalCount !== label.issues.totalCount) {
                                insVerifiedLabels({
                                    ...data.data.repository.label,
                                    error: true,
                                    errorMsg: 'This label has been modified in GitHub since it was last loaded locally. issues Counts are are different',
                                });
                                this.verifErrors++;
                            }
                            await cfgLabels.upsert({
                                id: data.data.repository.label.id
                            }, {
                                $set: data.data.repository.label
                            });
                        }
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
    newName: PropTypes.string,
    newColor: PropTypes.string,
    newDescription: PropTypes.string,
    labels: PropTypes.array.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,
    setVerifiedLabels: PropTypes.func.isRequired,
    insVerifiedLabels: PropTypes.func.isRequired,
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
    verifFlag: state.labelsEdit.verifFlag,
    action: state.labelsEdit.action,
    newName: state.labelsEdit.newName,
    newColor: state.labelsEdit.newColor,
    newDescription: state.labelsEdit.newDescription,

    labels: state.labelsEdit.labels,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.labelsEdit.setVerifFlag,
    setStageFlag: dispatch.labelsEdit.setStageFlag,
    setLabels: dispatch.labelsEdit.setLabels,
    setVerifiedLabels: dispatch.labelsEdit.setVerifiedLabels,
    insVerifiedLabels: dispatch.labelsEdit.insVerifiedLabels,

    updateChip: dispatch.chip.updateChip,
    setLoading: dispatch.loading.setLoading,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));