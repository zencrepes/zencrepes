import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import PropTypes from 'prop-types'
import autoBind from 'react-autobind';

import Login from './login/index.js';
import Dashboard from './dashboard/index.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { afterLoginPath: null };
        autoBind(this);
    }

    setAfterLoginPath(afterLoginPath) {
        this.setState({ afterLoginPath });
    }

    render() {
        const { props, state, setAfterLoginPath } = this;
        return (
            <Router>
                {!props.loading ? (
                    <div className="App">
                        <Switch>
                            <Route path="/" exact component={Login} />
                            <Route
                                path="/dashboard"
                                exact
                                component={Dashboard}
                            />
                        </Switch>
                    </div>
                ) : ''}
            </Router>
        );
    }
}

App.defaultProps = {
    userId: '',
    emailAddress: '',
};

App.propTypes = {
    loading: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    emailAddress: PropTypes.string,
    emailVerified: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
};


export default withTracker(() => {
    const loggingIn = Meteor.loggingIn();
    const user = Meteor.user();
    const userId = Meteor.userId();
    const loading = !Roles.subscription.ready();
    const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
    const emailAddress = user && user.emails && user.emails[0].address;

    return {
        loading,
        loggingIn,
        authenticated: !loggingIn && !!userId,
        name: name || emailAddress,
        roles: !loading && Roles.getRolesForUser(userId),
        userId,
        emailAddress,
        emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
    };
})(App);