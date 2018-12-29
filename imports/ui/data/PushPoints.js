import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgIssues } from "./Minimongo.js";

import GitHubApi from '@octokit/rest';
import PropTypes from "prop-types";

class PushPoints extends Component {
    constructor (props) {
        super(props);

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    // Component should only be updated if loadflag move from false to true (request to load data).
    shouldComponentUpdate(nextProps) {
        const { loadFlag } = this.props;
        if (!loadFlag && nextProps.loadFlag) {
            return true;
        } else {
            return false;
        }
    }

    load = async () => {
        const { setLoading, setLoadError, setLoadSuccess, setUpdatedIssues, incrementUpdatedIssues, setChipRemaining, log } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setUpdatedIssues(0);

        //Only work with issues for which points are not null
        for (let issue of cfgIssues.find({points:{ $exists: true, $ne: null }}).fetch()) {
            let pointsLabel = 'SP:' + issue.points;
            log.info('Processing issue: ' + issue.title);
            let existingLabels = [];
            if (issue.labels.totalCount > 0) {
                existingLabels = issue.labels.edges.map(label => label.node.name);
            }
            if (!existingLabels.includes(pointsLabel)) {
                log.info('Label: ' + pointsLabel + ' is not attached to issue');
                let result = false;
                try {
                    result = await this.octokit.issues.addLabels({
                        owner: issue.org.login,
                        repo: issue.repo.name,
                        number: issue.number,
                        labels: [pointsLabel]
                    });
                }
                catch (error) {
                    log.info(error);
                }
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    log.info(result);

                    //Prepare results data
                    let updatedData = result.data.map((label) => {
                        label['databaseId'] = label.id;
                        label['id'] = label.node_id;
                        return {
                            node: label
                        };
                    });

                    let issueObj = {
                        labels: {
                            totalCount: result.data.length,
                            edges: updatedData
                        },
                    };
                    await cfgIssues.upsert({
                        id: issue.id
                    }, {
                        $set: issueObj
                    });
                }
                incrementUpdatedIssues(1);
            }
        }
        setLoadSuccess(true);
        setLoading(false);
    }

    render() {
        return null;
    }
}

PushPoints.propTypes = {
    loading: PropTypes.bool.isRequired,
    loadFlag: PropTypes.bool.isRequired,
    log: PropTypes.object.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadError: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    setUpdatedIssues: PropTypes.func.isRequired,
    incrementUpdatedIssues: PropTypes.func.isRequired,
    setChipRemaining: PropTypes.func.isRequired,

};

const mapState = state => ({
    loadFlag: state.githubPushPoints.loadFlag,
    loading: state.githubPushPoints.loading,
    log: state.global.log,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubPushPoints.setLoadFlag,
    setLoading: dispatch.githubPushPoints.setLoading,
    setLoadError: dispatch.githubPushPoints.setLoadError,
    setLoadSuccess: dispatch.githubPushPoints.setLoadSuccess,
    setMessage: dispatch.githubPushPoints.setMessage,

    setUpdatedIssues: dispatch.githubPushPoints.setUpdatedIssues,
    incrementUpdatedIssues: dispatch.githubPushPoints.setIncrementUpdatedIssues,

    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(PushPoints));
