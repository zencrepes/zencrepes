import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import List from 'material-ui/List';

import FacetTitle from '../FacetTitle.js';
import FacetSelector from './FacetSelector.js';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

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
};

const SelectAllButton = (props) => {
    if (props.selectAll && props.length > 5) {
        return ( <Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(false)}>Unselect All</Button>);
    } else if (!props.selectAll && props.length > 5) {
        return (<Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(true)}>Select All</Button>);
    } else {
        return null;
    }
};

class TermFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
            selectAll: false,
        };
    }

    collapseFacet = value => () => {
        this.setState({collapsed: value})
    };

    render() {
        const { classes, facet, currentFilters } = this.props;
        const {header, data, group } = facet;
        const { collapsed, selectAll } = this.state;

        let valueChecked = {in:[]};
        if (currentFilters[group] !== undefined) {
            valueChecked = currentFilters[group];
        }

        let facetsData = data;
        if (collapsed) {
            facetsData = data.slice(0, 5);
        }

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader title={header} className={classes.cardHeader} />
                    <CardContent className={classes.cardContent}>
                        <List dense={this.state.dense}>
                            {facetsData.map(value => (
                                <FacetSelector
                                    data={value}
                                    key={value.name}
                                    selected={valueChecked.in.map((v) => {return v}).indexOf(value.name) !== -1}
                                />
                            ))}
                        </List>
                    </CardContent>
                    <CardActions>
                        <ExpandButton collapsed={collapsed} length={data.length} classes={classes} onClick={this.collapseFacet}/>
                    </CardActions>
                </Card>
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
    currentFilters: state.data.filters,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(TermFacet));
