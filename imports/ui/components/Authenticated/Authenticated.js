import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import {cfgSources} from "../../data/Minimongo.js";
import {cfgIssues} from "../../data/Minimongo.js";
import autoBind from "react-autobind";

class Authenticated extends React.Component {
    constructor(props) {
        super(props);
        props.setAfterLoginPath(`${window.location.pathname}${window.location.search}`);
    }
    /*
    componentWillMount() {
        this.props.setAfterLoginPath(`${window.location.pathname}${window.location.search}`);
    }*/

    render() {
        const {loggingIn, authenticated, component, path, exact, ...rest} = this.props;

        let redirectWizard = false;
        if ((cfgSources.find({}).count() === 0 || cfgIssues.find({}).count() === 0) && path !== '/wizard') {
            redirectWizard = true;
        }

        return (
            <Route
                path={path}
                exact={exact}
                render={props => (
                    authenticated ?
                        (
                            redirectWizard ? (
                                <Redirect to="/wizard" />
                            ) : (
                                React.createElement(component, {
                                ...props, ...rest, loggingIn, authenticated,
                                })
                            )
                        ) :
                        (<Redirect to="/login" />)
                )}
            />
        );
    }
}

Authenticated.defaultProps = {
    path: '',
    exact: false,
};

Authenticated.propTypes = {
    loggingIn: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    setAfterLoginPath: PropTypes.func.isRequired,
    path: PropTypes.string,
    exact: PropTypes.bool,
};

export default Authenticated;