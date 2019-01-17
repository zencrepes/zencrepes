import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import LabelsFetch from '../../data/Labels/Fetch/index.js';
import LabelsEdit from '../../data/Labels/Edit/index.js';

import LabelsTable from './LabelsTable/index.js';
import LabelsFacets from './Facets/index.js';
import LabelsQuery from './Query/index.js';
import Actions from "./Actions/index.js";

const style = {
    root: {
        marginRight: '10px'
    },
    fullWidth :{
        width: '100%',
    }
};

class Labels extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');
        if (queryUrl === null) {
            updateQuery({});
        } else {
            updateQuery(JSON.parse(queryUrl));
        }
    }

    componentDidUpdate(prevProps) {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = oldParams.get('q');

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
    }

    render() {
        const { classes, labels } = this.props;

        return (
            <General>
                <Actions />
                <LabelsFetch loadModal={false} />
                <LabelsEdit loadModal={false} />
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item >
                        <LabelsFacets />
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12} sm className={classes.fullWidth}>
                                <LabelsQuery />
                            </Grid>
                            <Grid item xs={12} sm className={classes.fullWidth}>
                                <LabelsTable labels={labels}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </General>
        );
    }
}

Labels.propTypes = {
    classes: PropTypes.object.isRequired,
    labels: PropTypes.array.isRequired,
    updateQuery: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.labelsView.updateQuery,
});

const mapState = state => ({
    labels: state.labelsView.labels,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(Labels)));
