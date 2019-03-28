import React, { Component } from 'react';
import _ from 'lodash';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { ResponsiveTreeMap } from '@nivo/treemap'

const styles = {
    root: {
        height: '150px'
    },
};

class ReposTreemap extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset() {
        const {repos, defaultPoints} = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'count';}
        let chartData = {
            name: 'repositories'
            , color: 'hsl(67, 70%, 50%)'
            , children: repos.map((v) => {
                return {name: v.name, count: v[metric]};
            })
        };
        return chartData;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
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
                    //label="name"
                    label={(e) => _.truncate(e.name, {length: 15, omission: '...'})}
                    labelFormat=''
                    labelSkipSize={40}
                    labelTextColor="inherit:darker(1.2)"
                    colors="nivo"
                    colorBy="name"
                    borderColor="inherit:darker(0.3)"
                    animate={true}
                    onClick={this.clickAssignee}
                    motionStiffness={90}
                    motionDamping={11}
                />
            </div>
        );
    }
}

ReposTreemap.propTypes = {
    classes: PropTypes.object.isRequired,
    repos: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ReposTreemap);

