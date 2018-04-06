import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

//import GQL_GET_USER from './../../../graphql/getUser.graphql';

const styles = {
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
};

function UserAvatar(props) {
    const { classes, currentUser } = props;
    if (currentUser !== undefined) {
        return (
            <div className={classes.root}>
                <Avatar alt={currentUser.name} src={currentUser.avatarUrl} className={classes.avatar} />
            </div>
        );
    } else {
        return null
    }
}

UserAvatar.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
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
    props: ({ data: { error, loading, user, refetch } }) => {
//        console.log(user);
//        console.log(error);
//        console.log(loading);
//        console.log(refetch);
        if (loading) return { userLoading: true };
        if (error) return { hasErrors: true };

        return {
            currentUser: user,
            refetch,
        };
    },
});

export default withData(withStyles(styles)(UserAvatar));