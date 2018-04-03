import React, { Component } from 'react';
import autoBind from 'react-autobind';

import OAuthLoginButtons from './OAuthLoginButtons.js';


class Login extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        return (
            <OAuthLoginButtons
                services={['github']}
            />
        );
    }
}
export default Login;