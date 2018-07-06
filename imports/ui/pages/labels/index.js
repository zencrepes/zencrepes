import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import AppMenu from '../../components/AppMenu/index.js';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

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
});

class Labels extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getCards() {
        console.log('getCards');

        let uniqueLabels = _.groupBy(cfgLabels.find({}).fetch(), 'name');
        console.log(uniqueLabels);

        let labels = [];
        Object.keys(uniqueLabels).map(idx => {
            labels.push({
                name: idx,
                labels: uniqueLabels[idx],
                repos: uniqueLabels[idx].map((label) => {
                    return label.repo;
                }),
                //issuesCount: uniqueLabels[idx].issues.totalCount
            });
        });

        return labels;
    }

    render() {
        const { classes } = this.props;
        console.log(cfgLabels);
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <GridList cellHeight={180} className={classes.gridList} cols={4}>
                        {this.getCards().map(label => (
                            <GridListTile key={label.name}>
                                <h4>{label.name}</h4>
                            </GridListTile>
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