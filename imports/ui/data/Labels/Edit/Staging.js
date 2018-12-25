import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_LABEL from '../../../../graphql/getSingleLabel.graphql';

import { cfgLabels } from '../../Minimongo.js';
import PropTypes from "prop-types";

class Staging extends Component {
    constructor (props) {
        super(props);
    }

    componentDidUpdate = (prevProps) => {
        const { setVerifFlag, verifFlag } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (verifFlag === true && prevProps.verifFlag === false) {
            setVerifFlag(false);
            this.load();
        }
    };

    load = async () => {
        const { setVerifying, setVerifyingMsg, labels, setVerifiedLabels, onSuccess, insVerifiedLabels, client } = this.props;
        setVerifiedLabels([]);
        setVerifyingMsg('About pull data from ' + labels.length + ' labels');
//        for (let label of labels) {
        for (const [idx, label] of labels.entries()) {
            if (this.props.verifying) {
                let baseMsg = (idx+1) + '/' + labels.length + ' - Fetching label: ' + label.org.login + '/' + label.repo.name + ' - ' + label.name;
                setVerifyingMsg(baseMsg);
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_SINGLE_LABEL,
                        variables: {
                            org_name: label.org.login,
                            repo_name: label.repo.name,
                            label_name: label.name
                        },
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                }
                catch (error) {
                    console.log(error);
                }
                console.log(data);
                if (data.data !== null) {
                    if (data.data.repository.label === null) {
                        // The label doesn't exist anymore on GitHub.
                        insVerifiedLabels({
                            id: label.id,
                            error: true,
                            errorMsg: 'This label doesn\'t exist in GitHub currently. Was it deleted ?',
                        });
                        await cfgLabels.remove({'id': label.id});
                    } else {
                        if (data.data.repository.label.updatedAt === label.updatedAt && data.data.repository.label.issues.totalCount === label.issues.totalCount) {
                            insVerifiedLabels({
                                ...data.data.repository.label,
                                error: false,
                            })
                        }
                        else if (data.data.repository.label.updatedAt !== label.updatedAt) {
                            insVerifiedLabels({
                                ...data.data.repository.label,
                                error: true,
                                errorMsg: 'This label has been modified in GitHub since it was last loaded locally. updatedAt dates are different',
                            })

                        } else if (data.data.repository.label.issues.totalCount !== label.issues.totalCount) {
                            insVerifiedLabels({
                                ...data.data.repository.label,
                                error: true,
                                errorMsg: 'This label has been modified in GitHub since it was last loaded locally. updatedAt dates are different',
                            })
                        }
                        await cfgLabels.upsert({
                            id: data.data.repository.label.id
                        }, {
                            $set: data.data.repository.label
                        });
                    }
                    this.props.updateChip(data.data.rateLimit);
                }
            }
        }
        setVerifying(false);
        onSuccess();
    };

    render() {
        return null;
    }
}

Staging.propTypes = {
    verifFlag: PropTypes.bool.isRequired,
    verifying: PropTypes.bool.isRequired,
    labels: PropTypes.array.isRequired,
    onSuccess: PropTypes.func.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setVerifyingMsg: PropTypes.func.isRequired,
    setVerifiedLabels: PropTypes.func.isRequired,
    insVerifiedLabels: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifFlag: state.labelsEdit.verifFlag,
    verifying: state.labelsEdit.verifying,

    labels: state.labelsEdit.labels,
    onSuccess: state.labelsEdit.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.labelsEdit.setVerifFlag,
    setVerifying: dispatch.labelsEdit.setVerifying,
    setVerifyingMsg: dispatch.labelsEdit.setVerifyingMsg,
    setVerifiedLabels: dispatch.labelsEdit.setVerifiedLabels,
    insVerifiedLabels: dispatch.labelsEdit.insVerifiedLabels,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));