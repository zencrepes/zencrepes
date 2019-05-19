import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import General from '../../layouts/General/index.js';

import NoData from './NoData/index.js';
import Actions from './Actions/index.js';
import TimelineView from './TimelineView/index.js';

const style = {
    root: {
        marginRight: '10px'
    },
    fullWidth :{
        width: '100%',
    }
};

class Roadmap extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        if (params.get('q') !== null) {
            const queryUrl = decodeURIComponent(params.get('q'));
            updateQuery(JSON.parse(queryUrl));
        } else {
            updateQuery({'state':{'$in':['OPEN']}});
        }
    }

    componentDidUpdate(prevProps) {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = decodeURIComponent(params.get('q'));

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = decodeURIComponent(oldParams.get('q'));

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
    }

    render() {
        const { milestones } = this.props;
        return (
            <General>
                {milestones.length === 0 ? (
                    <NoData />
                ) : (
                    <React.Fragment>
                        <Actions />
                        <span>Quick legend: Blue = Closed Issues, Green = Milestone Date, Grey = Estimated remaining effort from current date</span>
                        <TimelineView />
                    </React.Fragment>
                )}
            </General>
        );
    }
}

Roadmap.propTypes = {
    classes: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    milestones: PropTypes.array.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.roadmapView.updateQuery,
});

const mapState = state => ({
    milestones: state.roadmapView.milestones,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(Roadmap)));
