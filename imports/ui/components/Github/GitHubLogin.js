import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { GithubCircle } from 'mdi-material-ui'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        width: '100%',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});

class GitHubLogin extends Component {
    constructor(props) {
        super(props);
    }

    handleLogin = (callback) => {
        const options = {
            github: {
                requestPermissions: ['user:email','read:org','repo'],
                loginStyle: 'popup',
            }
        }['github'];

        return {
            github: Meteor.loginWithGithub
        }['github'](options, callback);
    };

    render() {
        const { classes, callback } = this.props;
        return (
            <Button variant="contained" className={classes.button} onClick={() => this.handleLogin(callback)}>
                <GithubCircle className={classNames(classes.leftIcon, classes.iconSmall)} />
                Log In with GitHub
            </Button>
        );
    }
}

GitHubLogin.defaultProps = {
    callback: (error) => {
        if (error) console.log(error.message, 'danger');
    },
};

GitHubLogin.propTypes = {
    classes: PropTypes.object.isRequired,
    callback: PropTypes.func,
};

const verificationComplete = new ReactiveVar(false);
const verifiedServices = new ReactiveVar([]);

export default withTracker(() => {
    if (!verificationComplete.get()) {
        Meteor.call('oauth.verifyConfiguration', ['github'], (error, response) => {
            if (error) {
                console.warn(error);
            } else {
                verifiedServices.set(response);
                verificationComplete.set(true);
            }
        });
    }

    return {
        services: verifiedServices.get(),
    };
})(withStyles(styles)(GitHubLogin));


