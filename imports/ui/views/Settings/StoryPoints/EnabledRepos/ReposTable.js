import React, { Component } from 'react';
import _ from 'lodash';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import fibonacci from 'fibonacci-fast';

import { cfgLabels, cfgSources } from "../../../../data/Minimongo.js";

class ReposTable extends Component {
    constructor(props) {
        super(props);
    }

    getRepoState() {
        return 'partial';
    };

    getGrouppedLabels() {
        let allLabels = [];
        let repos = cfgSources.find({active: true}).map(repo => {
            //Get Labels for repo
            let labels = cfgLabels.find({'repo.id': repo.id}).map(label => {
                allLabels.push(label);
            });
        });
        return _.groupBy(allLabels, 'name');
    }

    buildReferenceDataset(allLabels) {
        const { maxPoints } = this.props;
        let points = fibonacci.array(2, fibonacci.find(maxPoints).index + 1).map(x => x.number.toString());
        let totalRepos = cfgSources.find({active: true}).count();

        return points.map(point => {
            let labelPoint = 'SP:' + point;
            let labelConfigured = 0;
            if (allLabels[labelPoint] !== undefined) {
                labelConfigured = allLabels[labelPoint].length;
            }
            return {
                number: point,
                total: totalRepos,
                configured: labelConfigured,
                notConfigured: totalRepos - labelConfigured,
            }
        });
    }

    render() {
        const { classes } = this.props;
        let allLabels = this.getGrouppedLabels();
        let dataset = this.buildReferenceDataset(allLabels);
        return (
            <div>
                <Table>
                    <TableHead>
                        <TableRow key={0}>
                            <TableCell className={classes.tableCell} key={1}>Story Points</TableCell>
                            <TableCell className={classes.tableCell} key={2}>Configured</TableCell>
                            <TableCell className={classes.tableCell} key={3}>Not configured</TableCell>
                            <TableCell className={classes.tableCell} key={4}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataset.map((point, key) => {
                            return (
                                <TableRow key={point.number}>
                                    <TableCell key={1}>
                                        {point.number}
                                    </TableCell>
                                    <TableCell key={2}>
                                        {point.configured} repos
                                    </TableCell>
                                    <TableCell key={3}>
                                        {point.notConfigured} repos
                                    </TableCell>
                                    <TableCell key={4}>
                                        {point.total} repos
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );

    }
}

ReposTable.propTypes = {
    classes: PropTypes.object.isRequired,
    maxPoints: PropTypes.number.isRequired,
};

const mapState = state => ({
    maxPoints: state.githubLabels.maxPoints,
});

export default connect(mapState, null)(ReposTable);

