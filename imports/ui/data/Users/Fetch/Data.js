import { Meteor } from 'meteor/meteor';

import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_USER_DATA from '../../../../graphql/getUser.graphql';
import PropTypes from "prop-types";

class Data extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.errorRetry = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setLoadFlag, loadFlag, loading } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (loadFlag === true && prevProps.loadFlag === false && loading === false) {
            setLoadFlag(false);
            this.load();
        }
    };

    load = async () => {
        const {
            setLoading,
            setLoadingSuccess,
            loadUsers,
            client,
            refreshUsers,
            updateChip,
            log,
        } = this.props;

        let users = [];

        for (let i = 0; i < loadUsers.length; i++) {
            let data = {};
            try {
                data = await client.query({
                    query: GET_USER_DATA,
                    variables: {login: loadUsers[i]},
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'ignore',
                });
            }
            catch (error) {
                log.warn(error);
            }
            if (data.data !== undefined) {
                updateChip(data.data.rateLimit);
                users.push(data.data.user);
            } else {
                Meteor.logout();
            }
        }
        refreshUsers(users);
        log.info('Load completed: There is a total of ' + users.length + ' users in memory');
        setLoading(false);  // Set to true to indicate milestones are done loading.
        setLoadingSuccess(true);
    };

    render() {
        return null;
    }
}

Data.propTypes = {
    loading: PropTypes.bool.isRequired,
    loadFlag: PropTypes.bool.isRequired,
    loadUsers: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,
    refreshUsers: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,

    log: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadFlag: state.usersFetch.loadFlag,
    loading: state.loading.loading,

    loadUsers: state.usersFetch.loadUsers,

    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.usersFetch.setLoadFlag,

    setLoading: dispatch.loading.setLoading,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,

    refreshUsers: dispatch.usersView.refreshUsers,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Data));