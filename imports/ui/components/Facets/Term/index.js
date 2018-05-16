import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import List from 'material-ui/List';

import FacetTitle from '../FacetTitle.js';
import FacetSelector from './FacetSelector.js';

const styles = theme => ({
    root: {

    }
});

const ExpandButton = (props) => {
    if (props.collapsed && props.length > 5) {
        return ( <Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(false)}>more...</Button>);
    } else if (!props.collapsed && props.length > 5) {
        return (<Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(true)}>less</Button>);
    } else {
        return null;
    }
}

class TermFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    collapseFacet = value => () => {
        this.setState({collapsed: value})
    };

    render() {
        const { classes, facet, queryValues } = this.props;
        const {header, data, group } = facet;
        const { collapsed } = this.state;

        let valueChecked = [];
        if (queryValues[group] !== undefined) {
            valueChecked = queryValues[group];
        }

        let facetsData = data;
        if (collapsed) {
            facetsData = data.slice(0, 5);
        }

        return (
            <div className={classes.root}>
                <FacetTitle title={header} />
                <List dense={this.state.dense}>
                    {facetsData.map(value => (
                        <FacetSelector
                            data={value}
                            selected={valueChecked.map((v) => {return v.name}).indexOf(value.name) !== -1}
                        />
                    ))}
                </List>
                <ExpandButton collapsed={collapsed} length={data.length} classes={classes} onClick={this.collapseFacet}/>
            </div>
        );
    }
}

TermFacet.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    addFilterRefresh: dispatch.data.addFilterRefresh,
    removeFilterRefresh: dispatch.data.removeFilterRefresh,
});

const mapState = state => ({
    queryValues: state.data.filters,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(TermFacet));
