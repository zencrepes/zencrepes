import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {ResponsiveTreeMap} from "@nivo/treemap";

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
        return {
            name: 'repositories'
            , color: 'hsl(67, 70%, 50%)'
            , children: Object.keys(reposGroup).map((key) => {
                    return {name: key, count: reposGroup[key].length};
                })
        };
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
                        <div className={classes.treemap}>
                            <ResponsiveTreeMap
                                root={this.buildDataset()}
                                identity="name"
                                value="count"
                                innerPadding={3}
                                outerPadding={3}
                                leavesOnly={true}
                                margin={{
                                    "top": 0,
                                    "right": 0,
                                    "bottom": 0,
                                    "left": 0
                                }}
                                label="name"
                                labelFormat=""
                                labelSkipSize={40}
                                labelTextColor="inherit:darker(1.2)"
                                colors="nivo"
                                colorBy="name"
                                borderColor="inherit:darker(0.3)"
                                animate={true}
                                motionStiffness={90}
                                motionDamping={11}
                            />
                        </div>
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