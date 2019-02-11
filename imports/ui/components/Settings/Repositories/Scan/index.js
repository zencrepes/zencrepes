import React, { Component } from 'react';

import Orgs from './Orgs.js';
import OrgRepos from './OrgRepos.js';
import Repo from './Repo.js';

class Scan extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Orgs />
                <OrgRepos />
                <Repo />
            </React.Fragment>
        );
    }
}

export default Scan;
