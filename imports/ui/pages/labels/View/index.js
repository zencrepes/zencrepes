import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import AppMenu from '../../../components/AppMenu/index.js';
import TableLabels from '../../../components/Tables/Labels.js';

import { cfgLabels } from '../../../data/Labels.js';

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

class LabelsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            colors: [],
            descriptions: [],
            orgs: []
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        let label = this.props.match.params.name;
        let similarLabels = cfgLabels.find({'name': label}).fetch();

        let colorElements = _.groupBy(similarLabels, 'color');
        let colors = Object.keys(colorElements).map(idx => {return {
            items: colorElements[idx],
            count: colorElements[idx].length,
            name: "#" + colorElements[idx][0].color,
        }});
        colors = _.sortBy(colors, [function(o) {return o.count;}]);
        colors = colors.reverse();

        let descriptionsElements = _.groupBy(similarLabels, 'description');
        let descriptions = Object.keys(descriptionsElements).map(idx => {return {
            items: descriptionsElements[idx],
            count: descriptionsElements[idx].length,
            name: descriptionsElements[idx][0].description,
        }});
        descriptions = _.sortBy(descriptions, [function(o) {return o.count;}]);
        descriptions = descriptions.reverse();

        let orgElements = _.groupBy(similarLabels, 'rep.org.id');
        let orgs = Object.keys(orgElements).map(idx => {return {
            items: orgElements[idx],
            count: orgElements[idx].length,
            name: orgElements[idx][0].repo.org.name,
        }});

        this.setState({labels: similarLabels, colors: colors, descriptions: descriptions, orgs: orgs});
    }

    render() {
        const { classes } = this.props;
        const { labels, colors, descriptions, orgs } = this.state;
        console.log(labels);
        console.log(colors);
        console.log(descriptions);
        console.log(orgs);
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <h1>Configure Label: {this.props.match.params.name}</h1>
                    <Link to="/labels"><Button className={classes.button}>Back to List</Button></Link>
                    <Link to={"/labels/edit/" + this.props.match.params.name + "/all"}><Button className={classes.button}>Bulk Change</Button></Link>
                    <TableLabels labelsdata={labels} />
                </main>
            </div>
        );
    }
}

LabelsView.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(LabelsView)));