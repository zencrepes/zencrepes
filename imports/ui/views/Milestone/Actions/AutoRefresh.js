import { Component } from 'react';

import PropTypes from 'prop-types';

import {connect} from "react-redux";

class AutoRefresh extends Component {
    constructor (props) {
        super(props);
    }

    refreshSelectedRepos = () => {
        const { setLoadFlag, setLoadRepos, milestones, setOnSuccess, updateView } = this.props;

        setOnSuccess(updateView);
        setLoadRepos(milestones.map(ms => ms.repo.id));
        setLoadFlag(true);
    };

    updateTimer = () => {
        const {
            autoRefreshTimer,
            autoRefreshCount,
            autoRefreshMaxCount,
            autoRefreshDefaultTimer,
            setAutoRefreshTimer,
            setAutoRefreshEnable,
            setAutoRefreshCount,
            loading,
            log,
        } = this.props;

        const newTimer = autoRefreshTimer - 1;
        log.info('updateTimer: ' + newTimer);

        if (newTimer === 0) {
            log.info('Timer is 0, resetting');
            setAutoRefreshTimer(autoRefreshDefaultTimer);
            if (autoRefreshCount === autoRefreshMaxCount) {
                log.info('Reached max reset count, stopping');
                setAutoRefreshEnable(false);
                setAutoRefreshCount(0);
            } else {
                const newRefreshCount = autoRefreshCount + 1;
                log.info('Max count is at: ' + newRefreshCount + ' still refreshing');
                setAutoRefreshTimer(autoRefreshDefaultTimer);
                setAutoRefreshCount(newRefreshCount);
            }
            if (!loading) {
                log.info('===== REFRESH ISSUES ======');
                this.refreshSelectedRepos()
            }
        } else {
            setAutoRefreshTimer(newTimer);
        }

    };

    componentDidUpdate(prevProps) {
        const { autoRefreshEnable, autoRefreshTimer } = this.props;
        if ((prevProps.autoRefreshEnable === false && autoRefreshEnable === true) || (prevProps.autoRefreshTimer !== autoRefreshTimer)) {
            if (autoRefreshEnable === true) {
                setTimeout(() => {
                    this.updateTimer();
                }, 1000);
            }
        }
    }

    render() {
        return null;
    }
}

AutoRefresh.propTypes = {
    milestones: PropTypes.array.isRequired,
    autoRefreshEnable: PropTypes.bool.isRequired,
    autoRefreshTimer: PropTypes.number.isRequired,
    autoRefreshCount: PropTypes.number.isRequired,
    autoRefreshMaxCount: PropTypes.number.isRequired,
    autoRefreshDefaultTimer: PropTypes.number.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoadRepos: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,

    setAutoRefreshEnable: PropTypes.func.isRequired,
    setAutoRefreshTimer: PropTypes.func.isRequired,
    setAutoRefreshCount: PropTypes.func.isRequired,
    setAutoRefreshMaxCount: PropTypes.func.isRequired,

    loading: PropTypes.bool.isRequired,
    log: PropTypes.object.isRequired,

};

const mapState = state => ({
    autoRefreshEnable: state.milestoneView.autoRefreshEnable,
    autoRefreshTimer: state.milestoneView.autoRefreshTimer,
    autoRefreshCount: state.milestoneView.autoRefreshCount,
    autoRefreshMaxCount: state.milestoneView.autoRefreshMaxCount,
    autoRefreshDefaultTimer: state.milestoneView.autoRefreshDefaultTimer,

    milestones: state.milestoneView.milestones,

    loading: state.loading.loading,
    log: state.global.log,
//    issues: state.sprintsView.issues,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,

    updateView: dispatch.milestoneView.updateView,

    setAutoRefreshEnable: dispatch.milestoneView.setAutoRefreshEnable,
    setAutoRefreshTimer: dispatch.milestoneView.setAutoRefreshTimer,
    setAutoRefreshCount: dispatch.milestoneView.setAutoRefreshCount,
    setAutoRefreshMaxCount: dispatch.milestoneView.setAutoRefreshMaxCount,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(mapState, mapDispatch)(AutoRefresh);
