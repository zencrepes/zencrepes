import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';

import FacetSelector from './FacetSelector.js';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import blue from '@material-ui/core/colors/blue';


const styles = {
    root: {
        marginBottom: '10px',
    },
    cardContent: {
        padding: '0px',
    }
};

const cardStyle = {
    borderLeft: '4px solid ' + blue[900],
    borderTop: '1px solid #ccc',
    borderRadius: '0px',
    background: '#fafafa',
};

const cardHeaderStyle = {
    padding: '5px 2px 5px 5px',
    fontSize: '1.2rem',
    fontWeight: '300',
};

const cardContentStyle = {
    padding: '0px',
};

const ExpandButton = (props) => {
    if (props.collapsed && props.length > 5) {
        return ( <Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(false)}>more...</Button>);
    } else if (!props.collapsed && props.length > 5) {
        return (<Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(true)}>less</Button>);
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

    clickItem = (clickedValue) => {
        console.log('clickItem');
        const { facet, addRemoveQuery } = this.props;
        addRemoveQuery(clickedValue.name, facet);
    };

    render() {
        const { classes, facet, query, defaultPoints } = this.props;
        const { collapsed } = this.state;

        let selectedValues = [];
        let facetKey = facet.key;
        if (facet.nested === true) {
            facetKey = facetKey + '.edges';
        }
        if (query[facetKey] !== undefined) {
            if (facet.nested === false) {
                selectedValues = query[facetKey]['$in'];
            } else {
                let nestedKey = 'node.' + facet.nestedKey;
                selectedValues = query[facetKey]['$elemMatch'][nestedKey]['$in'];
            }
        }

        let facetsData = facet.values;
        if (defaultPoints) {
            facetsData = facetsData.sort((a, b) => b.points - a.points);
        } else {
            facetsData = facetsData.sort((a, b) => b.count - a.count);
        }
        if (collapsed) {
            facetsData = facet.values.slice(0, 5);
        }

        return (
            <div className={classes.root}>
                <Card style={cardStyle}>
                    <CardContent style={cardHeaderStyle}>
                        <span>{facet.name}</span>
                    </CardContent>
                    <CardContent style={cardContentStyle}>
                        <List dense={this.state.dense}>
                            {facetsData.map(value => (
                                <FacetSelector
                                    data={value}
                                    key={value.name}
                                    defaultPoints={defaultPoints}
                                    clickItem={this.clickItem}
                                    selected={selectedValues.indexOf(value.name) !== -1}
                                />
                            ))}
                        </List>
                    </CardContent>
                    <CardActions>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item xs={12} sm container>
                            </Grid>
                            <Grid item>
                                <ExpandButton collapsed={collapsed} length={facet.values.length} classes={classes} onClick={this.collapseFacet}/>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

TermFacet.propTypes = {
    classes: PropTypes.object.isRequired,
    facet: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    addRemoveQuery: PropTypes.func.isRequired,
};

export default withStyles(styles)(TermFacet);
