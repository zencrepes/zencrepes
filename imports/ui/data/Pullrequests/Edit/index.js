import React, { Component } from 'react';

import Staging from './Stage/Staging.js';
import Data from './Data.js';

class PullrequestsEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Staging />
                <Data />
            </React.Fragment>
        );
    }
}

export default PullrequestsEdit;
