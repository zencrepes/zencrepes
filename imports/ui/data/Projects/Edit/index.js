import React, { Component } from 'react';

import Data from './Data.js';
import Stage from './Stage/index.js';
import Staging from './Stage/Staging.js';

class ProjectsEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Data />
                <Stage />
                <Staging />
            </React.Fragment>
        );
    }
}

export default ProjectsEdit;
