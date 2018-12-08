import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import CustomCard from "../../../../components/CustomCard/index.js";

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
        return (
            <CustomCard
                headerTitle="With mixed states"
                headerFactTitle="Count"
                headerFactValue=" def"
            >
                <span>Milestones with Mixed states</span>
            </CustomCard>
        );
    }
}

Mixed.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Mixed);
