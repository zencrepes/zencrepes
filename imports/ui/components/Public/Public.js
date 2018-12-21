import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const Public = ({
                    loggingIn, authenticated, component, path, exact, ...rest
                }) => (
    <Route
        path={path}
        exact={exact}
        render={props => (
            React.createElement(component, {
                ...props, ...rest, loggingIn, authenticated,
            })
        )}
    />
);

Public.defaultProps = {
    path: '',
    exact: false,
    afterLoginPath: null,
};

Public.propTypes = {
    loggingIn: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    afterLoginPath: PropTypes.string,
    path: PropTypes.string,
    exact: PropTypes.bool,
};

export default Public;