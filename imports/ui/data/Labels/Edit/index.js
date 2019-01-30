import React, { Component } from 'react';

import Data from './Data.js';
import Stage from './Stage/index.js';
import Staging from './Stage/Staging.js';

class LabelsEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Data />
                <Stage />
                <Staging />
            </div>
        );
    }
}

export default LabelsEdit;
