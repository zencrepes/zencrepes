import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TextFacet from './TextFacet.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    progress: {
        margin: 10,
    },
});


class Facets extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('ComponentDidMount');
        const { initFacets } = this.props;
        initFacets();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate');
        // Do not update the components of facets or issues are currently loading
        if (nextProps.facetsLoading === true || nextProps.issuesLoading === true) {
            return false;
        } else {
            return true;
        }
    }

    /*
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { initFacets } = this.props;
        console.log('shouldComponentUpdate');
        initFacets();
    }
*/
    render() {
        console.log('render()');
        const { classes, issuesLoading, facets, clearFilters, clearResults, initFacets } = this.props;
        if (issuesLoading) {
            clearFilters();
            clearResults();
            return (
                <div className={classes.root}>
                    <Card className={classes.card}>
                        <CardContent>
                            <CircularProgress className={classes.progress} /> Loading ...
                        </CardContent>
                    </Card>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Card className={classes.card}>
                        <CardContent>
                            {facets.map(facet => (
                                <TextFacet facet={facet} key={facet.header}/>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            );
        }

    }
}

Facets.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    issuesLoading: state.github.issuesLoading,
    facets: state.data.facets,
    facetsLoading: state.data.loading,
});

const mapDispatch = dispatch => ({
    clearFilters: dispatch.data.clearFilters,
    clearResults: dispatch.data.clearResults,
    initFacets: dispatch.data.initFacets,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Facets));
