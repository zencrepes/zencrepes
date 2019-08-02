import React, { Component } from 'react';

import DataFetch from '../../../components/Settings/Repositories/DataFetch/index.js';

class Step3 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <DataFetch />
            </React.Fragment>
        );
    }
}

export default Step3;