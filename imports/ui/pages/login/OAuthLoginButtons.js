import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import OAuthLoginButton from './OAuthLoginButton';

//import './OAuthLoginButtons.scss';

const OAuthLoginButtons = ({ services }) => (services.length ? (
    <div className={`OAuthLoginButtons`}>
        {services.map(service => <OAuthLoginButton key={service} service={service} />)}
    </div>
) : <div />);

OAuthLoginButtons.propTypes = {
    services: PropTypes.array.isRequired,
};

const verificationComplete = new ReactiveVar(false);
const verifiedServices = new ReactiveVar([]);

export default withTracker(({ services }) => {
    if (!verificationComplete.get()) {
        Meteor.call('oauth.verifyConfiguration', services, (error, response) => {
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
})(OAuthLoginButtons);