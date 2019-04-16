import React, { Component } from 'react';
import _ from 'lodash';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { ResponsiveTreeMap } from '@nivo/treemap'

const styles = {
    root: {
        height: '200px'
    },
};

class MsTreemap extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset() {
        const { dataset } = this.props;
        let chartData = {
            name: 'milestones'
            , color: 'hsl(67, 70%, 50%)'
            , children: dataset.map((v) => {
                return {name: v.name, count: v.count, issues: v.issues};
            })
        };
        return chartData;
    }

    clickMilestone = ({data}) => {
        const { setUpdateQueryPath, setUpdateQuery } = this.props;
        const issuesArrayQuery = data.issues.map(issue => issue.id);
        const query = {'id': {'$in': issuesArrayQuery}};
        setUpdateQuery(query);
        setUpdateQueryPath('/issues/list');
    };

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
                    onClick={this.clickMilestone}
                    motionStiffness={90}
                    motionDamping={11}
                />
            </div>
        );
    }
}

MsTreemap.propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.array.isRequired,
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

export default withStyles(styles)(MsTreemap);

