import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';

const styles = {
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
};

function UserAvatar(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Avatar alt={Meteor.user().services.github.username} src="https://avatars3.githubusercontent.com/u/5667028?s=40&v=4" className={classes.avatar} />
        </div>
    );
}

UserAvatar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserAvatar);