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
        const { setLoadFlag, loadFlag } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (loadFlag === true && prevProps.loadFlag === false) {
            setLoadFlag(false);
            this.load();
        }
    };

    load = async () => {
        const {
            setLoading,
            setLoadSuccess,
            loadUsers,
            client,
            refreshUsers,
            updateChip,
        } = this.props;

        let users = [];

        for (let i = 0; i < loadUsers.length; i++) {
            let data = await client.query({
                query: GET_USER_DATA,
                variables: {login: loadUsers[i]},
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            });
            updateChip(data.data.rateLimit);
            users.push(data.data.user);
        }
        refreshUsers(users);
        console.log('Load completed: There is a total of ' + users.length + ' users in memory');
        setLoading(false);  // Set to true to indicate milestones are done loading.
        setLoadSuccess(true);
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
    setLoadSuccess: PropTypes.func.isRequired,
    setLoadedCount: PropTypes.func.isRequired,
    incLoadedCount: PropTypes.func.isRequired,
    refreshUsers: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
};

const mapState = state => ({
    loadFlag: state.usersFetch.loadFlag,
    loading: state.usersFetch.loading,

    loadUsers: state.usersFetch.loadUsers,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.usersFetch.setLoadFlag,
    setLoading: dispatch.usersFetch.setLoading,
    setLoadSuccess: dispatch.usersFetch.setLoadSuccess,
    setLoadedCount: dispatch.usersFetch.setLoadedCount,

    incLoadedCount: dispatch.usersFetch.incLoadedCount,
    refreshUsers: dispatch.usersView.refreshUsers,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Data));