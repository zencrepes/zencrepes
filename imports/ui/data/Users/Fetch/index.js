import React, { Component } from 'react';

import Data from './Data.js';

class UsersFetch extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Data />
        );
    }
}

UsersFetch.propTypes = {

};

export default UsersFetch;
