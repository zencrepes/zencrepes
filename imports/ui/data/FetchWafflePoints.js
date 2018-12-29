import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgIssues } from "./Minimongo.js";

import axios from 'axios';
import PropTypes from "prop-types";

/*
Load data about GitHub Orgs
 */
class FetchWafflePoints extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];
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

    getApiFromBoard = (url) => {
        /*
            FROM: https://waffle.io/overture-stack/roadmap
            TO: https://api.waffle.io/overture-stack/roadmap/cards
         */
        let regex = /.*?\/.*?\/.*?(\/)/;
        return 'https://api.waffle.io/' + url.replace(regex, '') + '/cards';
    };

    loadWafflePoints = (issue) => {
        const { setIncrementLoadedIssues, setMessage, log } = this.props;
        // Search for issue by number
        let existNode = cfgIssues.findOne({databaseId: issue.githubMetadata.id});
        if (existNode !== undefined && issue.size !== undefined) {
            log.info('updated points: ' + issue.size + ' for issue: ' + existNode.title + ' Closed At:' + existNode.closedAt);
            cfgIssues.update({id: existNode.id}, {$set:{'points':issue.size}});
            setIncrementLoadedIssues(1);
            setMessage('Updated points for issue: ' + existNode.title);
        }
        log.info(issue.githubMetadata.id);
        log.info(issue);
        log.info(existNode);
    };

    load = async () => {
        const { setLoading, setLoadError, setLoadSuccess, setLoadedIssues, boardUrl, log } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedIssues(0);

        let apiUrl = this.getApiFromBoard(boardUrl);
        log.info('Will making a call to: ' + apiUrl);

        let response = await axios({
            method:'get',
            url: apiUrl,
            responseType:'json'
        });
        await response.data.forEach((issue) => {
            this.loadWafflePoints(issue);
        });

        setLoadSuccess(true);
        setLoading(false);
    };

    render() {
        return null;
    }
}

FetchWafflePoints.propTypes = {
    loading: PropTypes.bool,
    loadFlag: PropTypes.bool,
    boardUrl: PropTypes.string,
    log: PropTypes.object.isRequired,

    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
    setLoadError: PropTypes.func,
    setLoadSuccess: PropTypes.func,
    setMessage: PropTypes.func,
    setLoadedIssues: PropTypes.func,
    setIncrementLoadedIssues: PropTypes.func,
};

const mapState = state => ({
    loadFlag: state.waffle.loadFlag,
    loading: state.waffle.loading,

    boardUrl: state.waffle.boardUrl,
    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.waffle.setLoadFlag,
    setLoading: dispatch.waffle.setLoading,
    setLoadError: dispatch.waffle.setLoadError,
    setLoadSuccess: dispatch.waffle.setLoadSuccess,
    setMessage: dispatch.waffle.setMessage,

    setLoadedIssues: dispatch.waffle.setLoadedIssues,
    setIncrementLoadedIssues: dispatch.waffle.setIncrementLoadedIssues,
});

export default connect(mapState, mapDispatch)(withApollo(FetchWafflePoints));
