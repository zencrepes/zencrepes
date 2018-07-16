import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { cfgLabels } from '../../../data/Labels.js';
import { cfgSources } from '../../../data/Orgs.js';


const styles = theme => ({
    root: {

    },

});

class LabelsEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabledRepos : [],
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        console.log(this.props);
//        let label = this.props.match.params.name;
//        let id = this.props.match.params.id;
        //if () {

        //}

    }

    render() {
        const { classes } = this.props;
        const { labels, colors, descriptions, orgs } = this.state;
        return (
            <div className={classes.root}>

            </div>
        );
    }
}

LabelsEdit.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(LabelsEdit)));