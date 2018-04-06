import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "react-redux";


//import GQL_GET_USER from './../../../graphql/getUser.graphql';

const styles = {
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
};

class UserAvatar extends React.Component {

    componentWillMount() {
        const { rateLimit } = this.props;
        //console.log(rateLimit);
        this.props.updateChip(rateLimit);
    }

    render() {
        const { classes, currentUser, rateLimit } = this.props;
        this.props.updateChip(rateLimit);
        if (currentUser !== undefined) {
            return (
                <div className={classes.root}>
                    <Avatar alt={currentUser.name} src={currentUser.avatarUrl} className={classes.avatar}/>
                </div>
            );
        } else {
            return null
        }
    }

}

UserAvatar.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    rateLimit: PropTypes.object,
    updateChip: PropTypes.func,
};

const GET_USER_DATA = gql`
    query {
      rateLimit {
        limit
        cost
        remaining
        resetAt
      }
      user(login: "fgerthoffert") {
        avatarUrl
        name
        login
      }
    }
`;

const withData = graphql(GET_USER_DATA, {
    // destructure the default props to more explicit ones
    props: ({ data: { error, loading, user, refetch, rateLimit } }) => {
        console.log(rateLimit);
        if (loading) return { userLoading: true };
        if (error) return { hasErrors: true };

        return {
            currentUser: user,
            rateLimit: rateLimit,
            refetch,
        };
    },
});

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip
});

export default connect(null, mapDispatch)(withData(withStyles(styles)(UserAvatar)));