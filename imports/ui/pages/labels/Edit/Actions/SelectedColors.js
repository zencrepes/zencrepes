import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import { ResponsivePie } from '@nivo/pie'

const styles = theme => ({
    root: {

    },

});

class SelectedColors extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    buildDataset() {
        const { selectedRepos } = this.props;
        console.log(selectedRepos);
        /*
        let dataset = repartition.filter(v => v.velocity !== undefined);

        dataset = dataset.map((vel) => {
            let effortRange = vel.velocity.find(v => v.range === vel.defaultVelocity);

            let metric = 'points';
            if (!defaultPoints) {metric = 'issues';}

            //let effort = Math.round(this.getRange(vel.velocity), 1);
            let effort = Math.round(effortRange[metric].effort, 1);
            if (effort === NaN || effort === Infinity) {effort = 0;}
            //return {x: vel.login, y: effort};
            return {id: vel.login, label: vel.login, value: effort};
        });

        return _.orderBy(dataset, ['y'], ['desc', 'asc']).slice(0, 10);
        */
        return [];
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <ResponsivePie
                    data={this.buildDataset()}
                    margin={{
                        "top": 0,
                        "right": 200,
                        "bottom": 0,
                        "left": 0
                    }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors="d320"
                    colorBy="id"
                    borderWidth={1}
                    borderColor="inherit:darker(0.2)"
                    enableRadialLabels={false}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor="inherit"
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor="#333333"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    theme={{
                        "tooltip": {
                            "container": {
                                "fontSize": "13px"
                            }
                        },
                        "labels": {
                            "textColor": "#555"
                        }
                    }}
                    legends={[
                        {
                            "anchor": "right",
                            "direction": "column",
                            "translateY": 0,
                            "translateX": 100,
                            "itemWidth": 100,
                            "itemHeight": 18,
                            "symbolSize": 18,
                            "symbolShape": "circle"
                        }
                    ]}
                />
            </div>
        );
    }
}

SelectedColors.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    selectedRepos: state.labelsconfiguration.selectedRepos,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(SelectedColors));