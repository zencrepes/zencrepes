import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from 'material-ui/styles';

import Button from '@material-ui/core/Button';

import FacetTitle from '../FacetTitle.js';

import _ from 'lodash';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

//import {cfgIssues} from "../../../data/Issues.js";


const styles = theme => ({
    root: {
        marginBottom: '10px',
    },
    card: {
        padding: '0px',
    },
    cardContent: {
        padding: '0px',
    },
    cardHeader: {
        padding: '5px',
    },
    button: {
        width: '60px',
        padding: '5px',

    }
});


class BoolFacet extends Component {
    constructor (props) {
        super(props);

    }

    updateBool = value => {
        console.log('updateBool');
        const { facet, addFilterRefresh } = this.props;
        if (value.count > 0 || value.bool === null) {
            addFilterRefresh({group: facet.group, bool: value.bool});
        }
    };
    
    getCount = (facet, name) => {
        let value = _.find(facet.data, {'name': name});
        console.log(value);
        if (value=== undefined) {value = {count: 0};}
        return value.count;
    };

    getYes = (currentFilters, facet) => {
        console.log(facet);
        let value = {
            color: 'primary',
            bool: true,
            count: this.getCount(facet, "true"),
        };
        if (currentFilters[facet.group] === undefined) {value.variant = null;}
        else if (currentFilters[facet.group].bool === true) {value.variant = 'raised'; value.color = 'secondary';}
        else {value.variant = null;}

        value.text = 'YES (' + value.count + ')';
        return value;
    };

    getNo = (currentFilters, facet) => {
        console.log(facet);
        let value = {
            color: 'primary',
            bool: false,
            count: this.getCount(facet, "false"),
        };
        if (currentFilters[facet.group] === undefined) {value.variant = null;}
        else if (currentFilters[facet.group].bool === false) {value.variant = 'raised'; value.color = 'secondary';}
        else {value.variant = null;}

        value.text = 'NO (' + value.count + ')';
        return value;
    };

    getAny = (currentFilters, facet) => {
        console.log(facet);
        let value = {
            color: 'primary',
            bool: null,
        };
        // If nothing is selected, any becomes the default:
        if (currentFilters[facet.group] === undefined) {value.variant = 'raised'; value.color = 'secondary';}
        else {value.variant = null;}
        value.text = 'ANY';
        return value;
    };

    render() {
        const { classes, facet, currentFilters } = this.props;
        // Since it's just 3 values, doing manual implementation
        let yesContent = this.getYes(currentFilters, facet);
        let noContent = this.getNo(currentFilters, facet);
        let anyContent = this.getAny(currentFilters, facet);
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader title={facet.header} className={classes.cardHeader} />
                    <CardContent className={classes.cardContent}>
                        <Button variant={yesContent.variant} color={yesContent.color} onClick={() => this.updateBool(yesContent)} className={classes.button}>{yesContent.text}</Button>
                        <Button variant={noContent.variant} color={noContent.color} onClick={() => this.updateBool(noContent)} className={classes.button}>{noContent.text}</Button>
                        <Button variant={anyContent.variant} color={anyContent.color} onClick={() => this.updateBool(anyContent)} className={classes.button}>{anyContent.text}</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

BoolFacet.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    addFilterRefresh: dispatch.data.addFilterRefresh,
});

const mapState = state => ({
    currentFilters: state.data.filters,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(BoolFacet));
