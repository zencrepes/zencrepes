import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import PropTypes from 'prop-types'
import autoBind from 'react-autobind';
import {connect} from "react-redux";

import Login from './views/Login/index.js';
import Wizard from './views/Wizard/index.js';
import Sprints from './views/Sprints/index.js';
import Settings from './views/Settings/index.js';;
import Labels from './views/Labels/index.js';
import LabelEdit from './views/Labels/Edit/index.js';

import Milestones from './views/Milestones/index.js';
import MilestoneEdit from './views/Milestones/Edit/index.js';
import Issues from './views/Issues/index.js';
import Terms from './views/Terms/index.js';
import About from './views/About/index.js';


import Index from './Index.js';

import Public from './components/Public/Public.js';
import Authenticated from './components/Authenticated/Authenticated.js';

import ApolloProviderGithub from './services/ApolloProviderGithub.js';

import Repos from './data/Repos.js';
import UsersFetch from './data/Users/Fetch/index.js';
import Startup from './components/Startup/index.js';

import ErrorBoundary from './ErrorBoundary.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { afterLoginPath: null };
        autoBind(this);
    }

    setAfterLoginPath(afterLoginPath) {
        this.setState({ afterLoginPath });
    };

    render() {
        const { props, state, setAfterLoginPath } = this;
        const {loadedIssues, loadedSources, loadedLabels, loadedQueries} = this.props;
        if ((!loadedIssues || !loadedSources || !loadedLabels || !loadedQueries) && Meteor.user() !== null) {
            return (
                <div>
                    <Startup />
                </div>
            )
        } else {
            return (
                <ApolloProviderGithub>
                    <div>
                            <Repos />
                            <UsersFetch />
                            <Router>
                                {!props.loading ? (
                                    <div className="App">
                                        <ErrorBoundary>
                                        <Switch>
                                            <Route exact name="index" path="/" component={Index} />
                                            <Public path="/login" component={Login} {...props} {...state} />
                                            <Authenticated exact path="/wizard" component={Wizard} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Authenticated exact path="/settings" component={Settings} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Authenticated exact path="/sprints" component={Sprints} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Authenticated exact path="/labels" component={Labels} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Authenticated exact path="/labels/edit/:name/:id" component={LabelEdit} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Authenticated exact path="/milestones" component={Milestones} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Authenticated exact path="/milestones/edit" component={MilestoneEdit} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Authenticated exact path="/issues" component={Issues} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                                            <Public exact path="/terms" component={Terms} {...props} {...state} />
                                            <Public exact path="/about" component={About} {...props} {...state} />
                                        </Switch>
                                        </ErrorBoundary>
                                    </div>
                                ) : ''}
                            </Router>
                    </div>
                </ApolloProviderGithub>
            );
        }

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

const mapState = state => ({
    loadedIssues: state.startup.loadedIssues,
    loadedSources: state.startup.loadedSources,
    loadedLabels: state.startup.loadedLabels,
    loadedQueries: state.startup.loadedQueries,
});

export default
    connect(mapState, null)
    (
        withTracker(() => {
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
        })
        (App)
    );
