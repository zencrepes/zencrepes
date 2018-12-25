import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_MILESTONE from '../../../../../graphql/getSingleMilestone.graphql';

import { cfgMilestones } from '../../../Minimongo.js';

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
        const { setVerifying, setVerifyingMsg, milestones, onStagingSuccess, setVerifiedMilestones, insVerifiedMilestones, client } = this.props;
        setVerifiedMilestones([]);
        setVerifyingMsg('About pull data from ' + milestones.length + ' milestones');
//        for (let milestone of milestones) {
        for (const [idx, milestone] of milestones.entries()) {
            console.log(milestone);
            if (this.props.verifying) {
                let baseMsg = (idx+1) + '/' + milestones.length + ' - Fetching milestone: ' + milestone.org.login + '/' + milestone.repo.name + '#' + milestone.number;
                setVerifyingMsg(baseMsg);
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_SINGLE_MILESTONE,
                        variables: {
                            org_name: milestone.org.login,
                            repo_name: milestone.repo.name,
                            milestone_number: milestone.number
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
                    if (data.data.repository.milestone === null) {
                        // The milestone doesn't exist anymore on GitHub.
                        insVerifiedMilestones({
                            id: milestone.id,
                            error: true,
                            errorMsg: 'This milestone doesn\'t exist in GitHub currently. Was it deleted ?',
                        });
                        await cfgMilestones.remove({'id': milestone.id});
                    } else {
                        if (data.data.repository.milestone.updatedAt === milestone.updatedAt && data.data.repository.milestone.issues.totalCount === milestone.issues.totalCount) {
                            insVerifiedMilestones({
                                ...data.data.repository.milestone,
                                error: false,
                            })
                        }
                        else if (data.data.repository.milestone.updatedAt !== milestone.updatedAt) {
                            insVerifiedMilestones({
                                ...data.data.repository.milestone,
                                error: true,
                                errorMsg: 'This milestone has been modified in GitHub since it was last loaded locally. updatedAt dates are different',
                            })

                        } else if (data.data.repository.milestone.issues.totalCount !== milestone.issues.totalCount) {
                            insVerifiedMilestones({
                                ...data.data.repository.milestone,
                                error: true,
                                errorMsg: 'This milestone has been modified in GitHub since it was last loaded locally. issues Counts are are different',
                            })
                        }
                        await cfgMilestones.upsert({
                            id: data.data.repository.milestone.id
                        }, {
                            $set: data.data.repository.milestone
                        });
                    }
                    this.props.updateChip(data.data.rateLimit);
                }
            }
        }
        setVerifying(false);
        onStagingSuccess();
    };

    render() {
        return null;
    }
}

Staging.propTypes = {
    verifFlag: PropTypes.bool.isRequired,
    verifying: PropTypes.bool.isRequired,
    milestones: PropTypes.array.isRequired,
    onStagingSuccess: PropTypes.func.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setVerifyingMsg: PropTypes.func.isRequired,
    setVerifiedMilestones: PropTypes.func.isRequired,
    insVerifiedMilestones: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifFlag: state.milestonesEdit.verifFlag,
    verifying: state.milestonesEdit.verifying,

    milestones: state.milestonesEdit.milestones,
    onStagingSuccess: state.milestonesEdit.onStagingSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setVerifying: dispatch.milestonesEdit.setVerifying,
    setVerifyingMsg: dispatch.milestonesEdit.setVerifyingMsg,
    setVerifiedMilestones: dispatch.milestonesEdit.setVerifiedMilestones,
    insVerifiedMilestones: dispatch.milestonesEdit.insVerifiedMilestones,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));