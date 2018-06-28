import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import Icon from '../../components/Icon/Icon.js';
//import './OAuthLoginButton.scss';

const handleLogin = (service, callback) => {
    const options = {
        github: {
            requestPermissions: ['user:email','read:org'],
            loginStyle: 'popup',
        }
    }[service];

    return {
        github: Meteor.loginWithGithub
    }[service](options, callback);
};

const serviceLabel = {
    github: <span><Icon icon="github" /> Log In with GitHub.</span>,
};

const OAuthLoginButton = ({ service, callback }) => (
    <button
        className={`OAuthLoginButton OAuthLoginButton-${service}`}
        type="button"
        onClick={() => handleLogin(service, callback)}
    >
        {serviceLabel[service]}
    </button>
);

OAuthLoginButton.defaultProps = {
    callback: (error) => {
        if (error) Bert.alert(error.message, 'danger');
    },
};

OAuthLoginButton.propTypes = {
    service: PropTypes.string.isRequired,
    callback: PropTypes.func,
};

export default OAuthLoginButton;