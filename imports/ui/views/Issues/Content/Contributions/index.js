import _ from 'lodash';
import React, { Component } from 'react';

import CustomCard from "../../../../components/CustomCard/index.js";

import ContributionsTable from './Table/index.js';
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Contributions extends Component {
    constructor (props) {
        super(props);
    }

    prepData = (contributions, defaultPoints) => {
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        let dataset = [];
        contributions.forEach((assignee) => {
            let assigneeName = assignee.assignee.name;
            if (assigneeName === "") {
                assigneeName = assignee.assignee.login;
            }
            let datesObj = {};
            assignee.all.dates.forEach((date) => {
                datesObj[date.date.slice(5, 10)] = date;
            });
            dataset.push({
                id: assigneeName + '-all',
                assignee: assigneeName,
                type: 'all',
                name: 'n/a',
                issues_count: assignee.all.total['issues'],
                points_count: assignee.all.total['points'],
                effort_count: assignee.all.total[metric],
                list: assignee.all.total['list'],
                effort_prct: 100,
                dates: assignee.all.dates,
                ...datesObj
            });

            const areaTotals = {
                issues: assignee.areas
                    .map(area => area.total.issues)
                    .reduce((acc, issues) => acc + issues, 0),
                points: assignee.areas
                    .map(area => area.total.points)
                    .reduce((acc, points) => acc + points, 0),
            };
            assignee.areas.forEach((area) =>{
                if (area.total[metric] > 0) {
                    let areaName = 'NO AREA';
                    if (area.label !== null) {
                        areaName = area.label.name;
                    }
                    let datesObj = {};
                    area.dates.forEach((date) => {
                        datesObj[date.date.slice(5, 10)] = date;
                    });
                    dataset.push({
                        id: assigneeName + '-area-' + areaName,
                        assignee: assigneeName,
                        type: 'area',
                        name: areaName,
                        list: area.total['list'],
                        issues_count: area.total['issues'],
                        points_count: area.total['points'],
                        effort_count: area.total[metric],
                        effort_prct: ((area.total[metric] === 0 || areaTotals[metric] === 0) ? 0 : Math.floor(area.total[metric]*100/areaTotals[metric])),
                        dates: area.dates,
                        ...datesObj
                    });
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
                if (milestone.total[metric] > 0) {
                    let milestoneName = 'NO MILESTONE';
                    if (milestone.milestone !== null) {
                        milestoneName = milestone.milestone.title;
                    }
                    let datesObj = {};
                    milestone.dates.forEach((date) => {
                        datesObj[date.date.slice(5, 10)] = date;
                    });
                    dataset.push({
                        id: assigneeName + '-milestone-' + milestoneName,
                        assignee: assigneeName,
                        type: 'milestone',
                        name: milestoneName,
                        list: milestone.total['list'],
                        issues_count: milestone.total['issues'],
                        points_count: milestone.total['points'],
                        effort_count: milestone.total[metric],
                        effort_prct: ((milestone.total[metric] === 0 || milestoneTotals[metric] === 0) ? 0 : Math.floor(milestone.total[metric]*100/milestoneTotals[metric])),
                        dates: milestone.dates,
                        ...datesObj
                    });
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
                if (project.total[metric] > 0) {
                    let projectName = 'NO PROJECT';
                    if (project.project !== null) {
                        projectName = project.project.name;
                    }
                    let datesObj = {};
                    project.dates.forEach((date) => {
                        datesObj[date.date.slice(5, 10)] = date;
                    });
                    dataset.push({
                        id: assigneeName + '-project-' + projectName,
                        assignee: assigneeName,
                        type: 'project',
                        name: projectName,
                        list: project.total['list'],
                        issues_count: project.total['issues'],
                        points_count: project.total['points'],
                        effort_count: project.total[metric],
                        effort_prct: ((project.total[metric] === 0 || projectsTotals[metric] === 0) ? 0 : Math.floor(project.total[metric]*100/projectsTotals[metric])),
                        dates: project.dates,
                        ...datesObj
                    });
                }
            });

        });
        dataset = _.orderBy(dataset, [function(o) {return String(o.assignee).toLowerCase()}]);
        return dataset;
    };

    render() {
        const { contributions, defaultPoints, setUpdateQueryPath, setUpdateQuery } = this.props;
        const tableData = this.prepData(contributions, defaultPoints);
        return (
            <CustomCard
                headerTitle="Contributions over the past 4 weeks"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="This table provides a view of closed issues within the past 4 weeks, broken down by project, by milestone and by area."
            >
                <ContributionsTable
                    contributions={tableData}
                    defaultPoints={defaultPoints}
                    setUpdateQueryPath={setUpdateQueryPath}
                    setUpdateQuery={setUpdateQuery}
                />
            </CustomCard>
        );
    }
}

Contributions.propTypes = {
    contributions: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    contributions: state.issuesView.contributions,
    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(Contributions);

