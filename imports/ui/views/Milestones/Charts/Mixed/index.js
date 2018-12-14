import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import CustomCard from "../../../../components/CustomCard/index.js";
import {withRouter} from "react-router-dom";

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
});


class Mixed extends Component {
    constructor (props) {
        super(props);
    }



    render() {
        const { classes, milestones } = this.props;

        const byTitle = _.groupBy(milestones, 'title');
        console.log(byTitle);

        const byState = Object.entries(byTitle)
            .filter(([name, content]) => {
                let closedMilestones = content.filter(milestone => milestone.state === 'CLOSED');
                let openMilestones = content.filter(milestone => milestone.state === 'OPEN');
                if (closedMilestones.length > 0 && openMilestones.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }).map(([name, content]) => {
                console.log(name);
                return {
                    name: name,
                    milestone: content,
                }
            });
        console.log(byState);
        return (
            <CustomCard
                headerTitle="Inconsistent States"
                headerFactTitle="Count"
                headerFactValue=" def"
            >
                <span>Milestones with identical title but different states</span>
            </CustomCard>
        );
    }
}

Mixed.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(Mixed)));