import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Timeline from 'react-timelines'
import 'react-timelines/lib/css/style.css';

const now = new Date();

// eslint-disable-next-line no-alert
const clickElement = element => alert(`Clicked element\n${JSON.stringify(element, null, 2)}`)

const MIN_ZOOM = 2
const MAX_ZOOM = 20

const style = {
    root: {
        marginRight: '10px'
    },
    fullWidth :{
        width: '100%',
    }
};

class TimelineView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            zoom: 2,
        }
    }

    handleToggleOpen = () => {
        this.setState({ open: !this.state.open })
    };

    handleZoomIn = () => {
        this.setState({
            zoom: Math.min(this.state.zoom + 1, MAX_ZOOM),
        })
    };

    handleZoomOut = () => {
        this.setState({
            zoom: Math.max(this.state.zoom - 1, MIN_ZOOM),
        })
    };

    render() {
        const { timelineStart, timelineEnd, timebar, tracks, openCloseTrack } = this.props;

        const { open, zoom } = this.state

        return (
            <Timeline
                scale={{
                    start: timelineStart,
                    end: timelineEnd,
                    zoom,
                    zoomMin: MIN_ZOOM,
                    zoomMax: MAX_ZOOM,
                }}
                isOpen={open}
                toggleOpen={this.handleToggleOpen}
                zoomIn={this.handleZoomIn}
                zoomOut={this.handleZoomOut}
                clickElement={clickElement}
                clickTrackButton={(track) => { alert(JSON.stringify(track)) }}
                timebar={timebar}
                tracks={tracks}
                now={now}
                toggleTrackOpen={openCloseTrack}
                enableSticky
                scrollToNow
            />
        );
    }
}

TimelineView.propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    milestones: PropTypes.array.isRequired,
    timelineStart: PropTypes.instanceOf(Date),
    timelineEnd: PropTypes.instanceOf(Date),
    timebar: PropTypes.array.isRequired,
    tracks: PropTypes.array.isRequired,
    openCloseTrack: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    openCloseTrack: dispatch.roadmapView.openCloseTrack,
});

const mapState = state => ({
    milestones: state.roadmapView.milestones,
    timelineStart: state.roadmapView.timelineStart,
    timelineEnd: state.roadmapView.timelineEnd,
    timebar: state.roadmapView.timebar,
    tracks: state.roadmapView.tracks,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(TimelineView)));
