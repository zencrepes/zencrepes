import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import IssuesTree from '../../../components/Charts/Nivo/IssuesTree.js';

const styles = {
    root: {
        margin: '10px',
        width: '100%',
    },
    treemap: {
        height: '320px'
    },
};

class IssuesRepartition extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset = () => {
        const { issues } = this.props;
        let reposGroup = _.groupBy(issues, 'repo.name');
        return Object.keys(reposGroup).map((key) => {
            return {name: key, count: reposGroup[key].length, issues: reposGroup[key]};
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Issues per repository
                        </Typography>
                        <IssuesTree
                            dataset={this.buildDataset()}
                            defaultPoints={false}
                            emptyName="Repositories"
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

IssuesRepartition.propTypes = {
    classes: PropTypes.object.isRequired,
    issues: PropTypes.array.isRequired,
};

export default withStyles(styles)(IssuesRepartition);