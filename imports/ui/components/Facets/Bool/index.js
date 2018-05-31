import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from 'material-ui/styles';

import Button from '@material-ui/core/Button';

import FacetTitle from '../FacetTitle.js';

import _ from 'lodash';

//import {cfgIssues} from "../../../data/Issues.js";


const styles = theme => ({
    root: {

    }
});


class BoolFacet extends Component {
    constructor (props) {
        super(props);

    }

    updateBool = value => {
        console.log('updateBool');
        const { facet, addFilterRefresh } = this.props;
        if (value.count > 0) {
            addFilterRefresh({group: facet.group, bool: value.bool});
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps);
//        if (nextProps.facet.data.length === 0){
//            return false;
//        }
        if (!_.isEqual(this.getYes(this.props.tableSelection, this.props.currentFilters, this.props.facet), this.getYes(nextProps.tableSelection, nextProps.currentFilters, nextProps.facet))) {
            return true;
        } else if (!_.isEqual(this.getNo(this.props.currentResults, this.props.tableSelection, this.props.currentFilters, this.props.facet), this.getNo(nextProps.currentResults, nextProps.tableSelection, nextProps.currentFilters, nextProps.facet))) {
            return true;
        } else if (!_.isEqual(this.getAny(this.props.currentResults, this.props.currentFilters, this.props.facet), this.getAny(nextProps.currentResults, nextProps.currentFilters, nextProps.facet))) {
            return true;
        }
        else {return false;}
    }

    getCount = (facet, name) => {
        let value = _.find(facet.data, {'name': name});
        console.log(value);
        if (value=== undefined) {value = {count: 0};}
        return value.count;
    };

    getYes = ( tableSelection, currentFilters, facet) => {
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

    getNo = (currentResults, tableSelection, currentFilters, facet) => {
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

    getAny = (currentResults, currentFilters, facet) => {
        console.log(facet);
        let count = this.getCount(facet, "true") + this.getCount(facet, "false");
        if (count === 0) {count = currentResults.length;}
        let value = {
            color: 'primary',
            bool: null,
            count: count,
        };
        // If nothing is selected, any becomes the default:
        if (currentFilters[facet.group] === undefined) {value.variant = 'raised'; value.color = 'secondary';}
        else {value.variant = null;}
        value.text = 'ANY (' + value.count + ')';
        return value;
    };

    render() {
        const { classes, facet, currentResults, tableSelection, currentFilters } = this.props;
        // Since it's just 3 values, doing manual implementation
        yesContent = this.getYes(tableSelection, currentFilters, facet);
        noContent = this.getNo(currentResults, tableSelection, currentFilters, facet);
        anyContent = this.getAny(currentResults, currentFilters, facet);
        return (
            <div className={classes.root}>
                <FacetTitle title={facet.header} />
                <Button variant={yesContent.variant} color={yesContent.color} onClick={() => this.updateBool(yesContent)} className={classes.button}>{yesContent.text}</Button>
                <Button variant={noContent.variant} color={noContent.color} onClick={() => this.updateBool(noContent)} className={classes.button}>{noContent.text}</Button>
                <Button variant={anyContent.variant} color={anyContent.color} onClick={() => this.updateBool(anyContent)} className={classes.button}>{anyContent.text}</Button>
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
    currentResults: state.data.results,
    tableSelection: state.data.tableSelection,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(BoolFacet));
