import React, { Component } from 'react';
import _ from 'lodash';

import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import { ResponsiveTreeMap } from '@nivo/treemap'

const styles = theme => ({
    root: {
        height: '150px'
    },
});

class ReposTreemap extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset() {
        const {assignees} = this.props;
        let chartData = {
            name: 'assignees'
            , color: 'hsl(67, 70%, 50%)'
            , children: assignees.map((v) => {
                return {name: v.login, count: v.open.points};
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
                    colors="d320"
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
};

export default withStyles(styles)(ReposTreemap);

