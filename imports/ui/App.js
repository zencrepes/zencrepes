import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import PropTypes from 'prop-types'
import autoBind from 'react-autobind';

//import Login from './pages/login/index.js';
import Login from './views/Login/index.js';
import Dashboard from './pages/dashboard/index.js';
import Settings from './pages/settings/index.js';
import Search from './pages/search/index.js';
import Velocity from './pages/velocity/index.js';
import Index from './Index.js';

import Public from './components/Public/Public.js'
import Authenticated from './components/Authenticated/Authenticated.js'

import ApolloProviderGithub from './services/ApolloProviderGithub.js';

import Issues from './data/Issues.js';
import Labels from './data/Labels.js';
import Repos from './data/Repos.js';
import QueryManage from './components/Query/Manage/index.js';
import QuerySave from './components/Query/Save/index.js';

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
        console.log(props);
        return (
            <ApolloProviderGithub>
                <div>
                    <Issues />
                    <Labels />
                    <Repos />
                    <QueryManage />
                    <QuerySave />
                    <Router>
                        {!props.loading ? (
                            <div className="App">
                                <Switch>
                                    <Route exact name="index" path="/" component={Index} />
                                    <Public path="/login" component={Login} {...props} {...state} />
                                    <Authenticated exact path="/dashboard" component={Dashboard} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                    <Authenticated exact path="/settings" component={Settings} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                    <Authenticated exact path="/search" component={Search} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                    <Authenticated exact path="/velocity" component={Velocity} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                </Switch>
                            </div>
                        ) : ''}
                    </Router>
                </div>
            </ApolloProviderGithub>
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

const getUserName = name => ({
    string: name,
    object: `${name.first} ${name.last}`,
}[typeof name]);


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