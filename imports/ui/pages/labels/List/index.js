import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withTracker } from 'meteor/react-meteor-data';

import AppMenu from '../../../components/AppMenu/index.js';

import { cfgLabels } from '../../../data/Labels.js';

import LabelsTable from './LabelsTable.js';
import {connect} from "react-redux";


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        paddingTop: 80,
        minWidth: 0, // So the Typography noWrap works
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    card: {
        minWidth: 275,
        margin: 10,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

class LabelsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: []
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        let uniqueLabels = _.groupBy(cfgLabels.find({}).fetch(), 'name');

        let labels = [];
        Object.keys(uniqueLabels).map(idx => {
            let colorElements = _.groupBy(uniqueLabels[idx], 'color');
            let colors = Object.keys(colorElements).map(idx => {return {
                items: colorElements[idx],
                count: colorElements[idx].length,
                name: "#" + colorElements[idx][0].color,
            }});
            colors = _.sortBy(colors, [function(o) {return o.count;}]);
            colors = colors.reverse();

            let descriptionsElements = _.groupBy(uniqueLabels[idx], 'description');
            let descriptions = Object.keys(descriptionsElements).map(idx => {return {
                items: descriptionsElements[idx],
                count: descriptionsElements[idx].length,
                name: descriptionsElements[idx][0].description,
            }});
            descriptions = _.sortBy(descriptions, [function(o) {return o.count;}]);
            descriptions = descriptions.reverse();

            /*
            let orgElements = _.groupBy(uniqueLabels[idx], 'repo.org.id');
            let orgs = Object.keys(orgElements).map(idx => {return {
                items: orgElements[idx],
                count: orgElements[idx].length,
                name: orgElements[idx][0].repo.org.name,
            }});
            */

            labels.push({
                name: idx,
                count: uniqueLabels[idx].length,
                labels: uniqueLabels[idx],
                colors: colors,
                //orgs: orgs,
                descriptions: descriptions,
            });
        });
        labels = _.sortBy(labels, [function(o) {return o.labels.length;}]);
        labels = labels.reverse();
        this.setState({labels: labels});
    }

    render() {
        const { classes } = this.props;
        const { labels } = this.state;
        //console.log(labels);
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <LabelsTable labelsdata={labels} />
                </main>
            </div>
        );
    }
}

LabelsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LabelsList);
