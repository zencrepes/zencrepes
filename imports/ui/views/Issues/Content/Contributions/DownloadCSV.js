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

        let header = ['assignee', 'type', 'name', 'issues count', 'effort(' + metric + ')', 'effort(%)'];
        let headerSet = false;
        let dataset = [];
        contributions.forEach((assignee) => {
            let assigneeName = assignee.assignee.name;
            if (assigneeName === "") {
                assigneeName = assignee.assignee.login;
            }
            const allDataset = [assigneeName, 'all', 'n/a', assignee.all.total['issues'], assignee.all.total[metric], '100'];
            assignee.all.dates.forEach((date) =>{
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

            const areaTotals = {
                issues: assignee.areas
                    .map(area => area.total.issues)
                    .reduce((acc, issues) => acc + issues, 0),
                points: assignee.areas
                    .map(area => area.total.points)
                    .reduce((acc, points) => acc + points, 0),
            };
            assignee.areas.forEach((area) =>{
                const areaDataset = [assigneeName, 'areas'];
                let areaName = 'NO AREA';
                if (area.label !== null) {
                    areaName = area.label.name;
                }
                areaDataset.push(areaName);
                areaDataset.push(area.total['issues']); // Issues count
                areaDataset.push(area.total[metric]); // total
                areaDataset.push(((area.total[metric] === 0 || areaTotals[metric] === 0) ? 0 : Math.floor(area.total[metric]*100/areaTotals[metric]))); // %
                area.dates.forEach((date) => {
                    if (date[metric] === 0) {
                        areaDataset.push('');
                    } else {
                        areaDataset.push(date[metric]);
                    }
                });
                if (area.total[metric] > 0) {
                    dataset.push(areaDataset);
                }
            });

            const milestoneTotals = {
                issues: assignee.milestones
                    .map(milestone => milestone.total.issues)
                    .reduce((acc, issues) => acc + issues, 0),
                points: assignee.milestones
                    .map(milestone => milestone.total.points)
                    .reduce((acc, points) => acc + points, 0),
            };

            assignee.milestones.forEach((milestone) =>{
                const milestoneDataset = [assigneeName, 'milestones'];
                let milestoneName = 'NO MILESTONE';
                if (milestone.milestone !== null) {
                    milestoneName = milestone.milestone.title;
                }
                milestoneDataset.push(milestoneName);
                milestoneDataset.push(milestone.total['issues']); // Issues count
                milestoneDataset.push(milestone.total[metric]); // total
                milestoneDataset.push(((milestone.total[metric] === 0 || milestoneTotals[metric] === 0) ? 0 : Math.floor(milestone.total[metric]*100/milestoneTotals[metric]))); // %
                milestone.dates.forEach((date) => {
                    if (date[metric] === 0) {
                        milestoneDataset.push('');
                    } else {
                        milestoneDataset.push(date[metric]);
                    }
                });
                if (milestone.total[metric] > 0) {
                    dataset.push(milestoneDataset);
                }
            });

            const projectsTotals = {
                issues: assignee.projects
                    .map(project => project.total.issues)
                    .reduce((acc, issues) => acc + issues, 0),
                points: assignee.projects
                    .map(project => project.total.points)
                    .reduce((acc, points) => acc + points, 0),
            };
            assignee.projects.forEach((project) =>{
                const projectDataset = [assigneeName, 'projects'];
                let projectName = 'NO PROJECT';
                if (project.project !== null) {
                    projectName = project.project.name;
                }
                projectDataset.push(projectName);
                projectDataset.push(project.total['issues']); // Issues count
                projectDataset.push(project.total[metric]); // total
                projectDataset.push(((project.total[metric] === 0 || projectsTotals[metric] === 0) ? 0 : Math.floor(project.total[metric]*100/projectsTotals[metric]))); // %
                project.dates.forEach((date) => {
                    if (date[metric] === 0) {
                        projectDataset.push('');
                    } else {
                        projectDataset.push(date[metric]);
                    }
                });
                if (project.total[metric] > 0) {
                    dataset.push(projectDataset);
                }
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
