import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import PullrequestsFetch from '../../data/Pullrequests/Fetch/index.js';
import PullrequestsEdit from '../../data/Pullrequests/Edit/index.js';

import Actions from './Actions/index.js';
import PullrequestsFacets from './Facets/index.js';
import PullrequestsQuery from './Query/index.js';
import PullrequestsTabs from './Tabs/index.js';
import PullrequestsContent from './Content/index.js';

import NoData from './NoData/index.js';

const style = {
    root: {
        marginRight: '10px'
    },
    fullWidth :{
        width: '100%',
    }
};

class Pullrequests extends Component {
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
        const { classes, pullrequests } = this.props;
        return (
            <General>
                <PullrequestsFetch />
                <PullrequestsEdit />
                {pullrequests.length === 0 ? (
                    <NoData />
                ) : (
                    <React.Fragment>
                        <Actions />
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item >
                                <PullrequestsFacets />
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <Grid item xs={12} sm className={classes.fullWidth}>
                                        <PullrequestsQuery />
                                    </Grid>
                                    <Grid item xs={12} sm className={classes.fullWidth}>
                                        <PullrequestsTabs />
                                    </Grid>
                                    <Grid item xs={12} sm className={classes.fullWidth}>
                                        <PullrequestsContent />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
            </General>
        );
    }
}

Pullrequests.propTypes = {
    classes: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    pullrequests: PropTypes.array.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.pullrequestsView.updateQuery,
});

const mapState = state => ({
    pullrequests: state.pullrequestsView.pullrequests,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(Pullrequests)));
