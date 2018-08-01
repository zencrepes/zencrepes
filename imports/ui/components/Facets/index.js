import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TextFacet from './TextFacet.js';
import RangeFacet from './Range/index.js';
import TermFacet from './Term/index.js';
import BoolFacet from './Bool/index.js';

import {cfgIssues} from '../../data/Minimongo.js';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
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
        console.log('facets - ComponentDidMount');
        const { initFacets } = this.props;
        initFacets();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('facets - shouldComponentUpdate');
        // Do not update the components of facets or issues are currently loading
        if (nextProps.facetsLoading === true || nextProps.issuesLoading === true) {
            return false;
        } else {
            return true;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { initFacets, issuesLoading } = this.props;
        console.log('facets - componentDidUpdate');
        if (prevProps.issuesLoading === true && issuesLoading==false) {
            console.log('facets - componentDidUpdate - Trigger initFacets');
            initFacets();
        }
    }

    render() {
        console.log('Facets - render()');
        const { classes, facets, clearFilters, clearResults, initFacets } = this.props;
        if (this.props.issuesLoading) {
            console.log('Facets - clearing facets');
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
            console.log('Facets - re-rendering facets');
            return (
                <div className={classes.root}>
                    {facets.map(facet => {
                        switch (facet.type) {
                            case 'text' :
                                return ( <TermFacet facet={facet} key={facet.header}/>);
                            case 'textCount':
                                return ( <TermFacet facet={facet} key={facet.header}/>);
                            case 'range':
                                return ( <RangeFacet facet={facet} key={facet.header}/>);
                            case 'bool':
                                return ( <BoolFacet facet={facet} key={facet.header}/>);
                        }
                    })}
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
