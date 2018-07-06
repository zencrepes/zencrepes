import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import AppMenu from '../../components/AppMenu/index.js';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { cfgLabels } from '../../data/Labels.js';


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
    gridList: {
        width: 1000,
        height: 450,
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

class Labels extends Component {
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
                name: colorElements[idx][0].color,
            }});

            let descriptionsElements = _.groupBy(uniqueLabels[idx], 'description');
            let descriptions = Object.keys(descriptionsElements).map(idx => {return {
                items: descriptionsElements[idx],
                count: descriptionsElements[idx].length,
                name: descriptionsElements[idx][0].description,
            }});

            let orgElements = _.groupBy(uniqueLabels[idx], 'org.id');
            let orgs = Object.keys(orgElements).map(idx => {return {
                items: orgElements[idx],
                count: orgElements[idx].length,
                name: orgElements[idx][0].org.name,
            }});

            //orgs: _.uniqBy(uniqueLabels[idx].map(label => label.org), 'id'),
            //_.uniq(uniqueLabels[idx].map(label => label.color)),

            labels.push({
                name: idx,
                count: uniqueLabels[idx].length,
                labels: uniqueLabels[idx],
                colors: colors,
                orgs: orgs,
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
        console.log(labels);
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <GridList cellHeight={180} className={classes.gridList} cols={4}>
                        {labels.map(label => (
                            <Card className={classes.card} key={label.name}>
                                <CardContent>
                                    <Typography variant="headline" component="h2">
                                        {label.name}
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Used in {label.count} repositories
                                    </Typography>
                                    <Typography component="p">
                                        <b><i>Consistency score: </i></b> <br />
                                        Different colors: {label.colors.length} <br />
                                        Different descriptions: {label.descriptions.length} <br />
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        ))}
                    </GridList>
                </main>
            </div>
        );
    }
}

Labels.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(Labels)));