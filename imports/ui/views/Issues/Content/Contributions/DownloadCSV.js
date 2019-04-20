import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TableIcon from 'mdi-react/TableIcon';
import { CSVDownload } from "react-csv";

import {connect} from "react-redux";

import {reactLocalStorage} from 'reactjs-localstorage';

class DownloadCSV extends Component {
    constructor (props) {
        super(props);
        this.state = {
            clicked: false,
        }
    }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked });
    };

    formatData = (contributions) => {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        let header = ['assignee', 'type', 'name', 'effort'];
        let headerSet = false;
        let dataset = [];
        contributions.forEach((assignee) => {
            let assigneeName = assignee.assignee.name;
            if (assigneeName === "") {
                assigneeName = assignee.assignee.login;
            }
            const allDataset = [assigneeName, 'all', 'n/a', ''];
            assignee.all.forEach((date) =>{
                //2019-03-23T00:00:00.000Z
                if (headerSet === false) {
                    header.push(date.date.slice(5, 10));
                }
                if (date[metric] === 0) {
                    allDataset.push('');
                } else {
                    allDataset.push(date[metric]);
                }
            });
            if (headerSet === false) {
                dataset.push(header);
            }
            headerSet = true;
            dataset.push(allDataset);

            assignee.areas.forEach((area) =>{
                const areaDataset = [assigneeName, 'areas'];
                let areaName = 'NO AREA';
                if (area.label !== null) {
                    areaName = area.label.name;
                }
                areaDataset.push(areaName);
                areaDataset.push('');
                area.dates.forEach((date) => {
                    if (date[metric] === 0) {
                        areaDataset.push('');
                    } else {
                        areaDataset.push(date[metric]);
                    }
                });
                dataset.push(areaDataset);
            });

            assignee.milestones.forEach((milestone) =>{
                const milestoneDataset = [assigneeName, 'milestones'];
                let milestoneName = 'NO MILESTONE';
                if (milestone.milestone !== null) {
                    milestoneName = milestone.milestone.title;
                }
                milestoneDataset.push(milestoneName);
                milestoneDataset.push('');
                milestone.dates.forEach((date) => {
                    if (date[metric] === 0) {
                        milestoneDataset.push('');
                    } else {
                        milestoneDataset.push(date[metric]);
                    }
                });
                dataset.push(milestoneDataset);
            });

            assignee.projects.forEach((project) =>{
                const projectDataset = [assigneeName, 'projects'];
                let projectName = 'NO PROJECT';
                if (project.project !== null) {
                    projectName = project.project.name;
                }
                projectDataset.push(projectName);
                projectDataset.push('');
                project.dates.forEach((date) => {
                    if (date[metric] === 0) {
                        projectDataset.push('');
                    } else {
                        projectDataset.push(date[metric]);
                    }
                });
                dataset.push(projectDataset);
            });


        });
        return dataset;
    };

    render() {
        const {contributions } = this.props;
        const {clicked } = this.state;

        if (JSON.parse(reactLocalStorage.get('enableExperimental', false)) && contributions.length > 0) {
            return (
                <React.Fragment>
                <Button aria-label="Open" onClick={this.handleClick}>
                    Download CSV
                    <TableIcon />
                </Button>
                {clicked &&
                    <CSVDownload data={this.formatData(contributions)} target="_blank" />
                }
                </React.Fragment>
            )
        } else {
            return null;
        }
    }
}

DownloadCSV.propTypes = {
    classes: PropTypes.object.isRequired,
    clearIssues: PropTypes.func.isRequired,
    issues: PropTypes.array.isRequired,
};

DownloadCSV.propTypes = {
    contributions: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

const mapState = state => ({
    contributions: state.issuesView.contributions,
    defaultPoints: state.issuesView.defaultPoints,
});

export default connect(mapState, null)(DownloadCSV);