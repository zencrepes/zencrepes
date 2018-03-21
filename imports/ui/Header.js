import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { gh_issues } from '../data_fetch/LoadIssues.js'
import { gh_milestones } from '../data_fetch/LoadIssues.js'
import { gh_repositories } from '../data_fetch/LoadRepos.js'
import { gh_organizations } from '../data_fetch/LoadOrgs.js'

import Button from 'material-ui/Button';

import {LoadOrgs} from '../data_fetch/LoadOrgs.js'

class Header extends Component {
    reloadData() {
        console.log("Empty all data and reload");
        gh_issues.remove({});
        gh_milestones.remove({});
        gh_repositories.remove({});
        gh_organizations.remove({});
        window.store_autoupdate = true;
        LoadOrgs(window.client);
    }
    render() {
        return (
            <div className="App-header">
                <Button variant="raised" color="primary" onClick={this.reloadData.bind(this)} >
                    (re)Load data
                </Button>
                Total number of issues {this.props.issues_count}, repositories: {this.props.repositories_count}, organizations: {this.props.organizations_count}, milestones: {this.props.milestones_count}
            </div>
        );
    }
}

export default withTracker(() => {
    return {
        issues_count: gh_issues.find({}).count(),
        repositories_count: gh_repositories.find({}).count(),
        organizations_count: gh_organizations.find({}).count(),
        milestones_count: gh_milestones.find({}).count(),
    };
})(Header);
