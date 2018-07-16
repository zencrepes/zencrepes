import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import AppMenu from '../../components/AppMenu/index.js';
import TableLabels from '../../components/Tables/Labels.js';

import LabelsEdit from '../../components/Labels/Edit/index.js';

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

class LabelsEditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        console.log(this.props);

    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <h1>Edit Label: {this.props.match.params.name}</h1>
                    <Link to="/labels"><Button className={classes.button}>Back to List</Button></Link>
                    <Link to={"/labels/view/" + this.props.match.params.name}><Button className={classes.button}>Back Configuration</Button></Link>
                    <LabelsEdit />
                </main>
            </div>
        );
    }
}

LabelsEditPage.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(LabelsEditPage)));