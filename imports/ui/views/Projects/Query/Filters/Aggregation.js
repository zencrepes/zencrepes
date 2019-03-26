import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Value from './Value.js';

const styles = {
    root: {
        marginLeft: '5px',
    },
    query: {
        flex: 1,
    },

};

const ExpandButton = (props) => {
    if (props.collapsed && props.length > 2) {
        return ( <Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(false)}>...</Button>);
    } else if (!props.collapsed && props.length > 2) {
        return (<Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(true)}>less</Button>);
    } else {
        return null;
    }
};

class Aggregation extends Component {
    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    collapseValues = value => () => {
        this.setState({collapsed: value})
    };

    render() {
        const { classes, query, facets, currentFacet, updateQuery } = this.props;
        const { collapsed } = this.state;

        let facetsValues = currentFacet.values;
        if (collapsed) {
            facetsValues = currentFacet.values.slice(0, 2);
        }

        return (
            <div className={classes.root}>
                <span>{currentFacet.name} </span>
                {facetsValues.length === 1 &&
                    <span>is</span>
                }
                {facetsValues.length > 1 &&
                <span> in (</span>
                }
                {facetsValues.map(value => (
                    <Value
                        key={value}
                        query={query}
                        facets={facets}
                        currentFacet={currentFacet}
                        value={value}
                        updateQuery={updateQuery}
                    />
                ))}
                <ExpandButton collapsed={collapsed} length={currentFacet.values.length} classes={classes} onClick={this.collapseValues}/>
                {facetsValues.length > 1 &&
                <span> )</span>
                }
                {facets.slice(-1)[0].name !== currentFacet.name &&
                    // Do not display "and" if last item of the array
                    <span> and </span>
                }
            </div>
        );
    }
}

Aggregation.propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    facets: PropTypes.array.isRequired,
    currentFacet: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
};

export default withStyles(styles)(Aggregation);
