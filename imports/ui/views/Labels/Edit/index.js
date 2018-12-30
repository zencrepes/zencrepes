import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../../layouts/General/index.js';

import SelectedColors from './Stats/SelectedColors.js';
import SelectedDescriptions from './Stats/SelectedDescriptions.js';
import EditSelection from './Selection/index.js';
import EditActions from './Actions/index.js';

class LabelEdit extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { initConfiguration } = this.props;
        let labelName = this.props.match.params.name;
        initConfiguration(labelName)
    }

    componentDidUpdate(prevProps) {
        const { initConfiguration, loadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            let labelName = this.props.match.params.name;
            initConfiguration(labelName)
        }
    }

    render() {
        return (
            <General>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={6} md={4}>
                        <SelectedColors />
                    </Grid>
                    <Grid item xs={12} sm={6} md={8}>
                        <SelectedDescriptions />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <EditSelection />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <EditActions />
                    </Grid>
                </Grid>
            </General>
        );
    }
}

LabelEdit.propTypes = {
    loadSuccess: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    initConfiguration: PropTypes.func.isRequired,
};

const mapState = state => ({
    loadSuccess: state.labelsEdit.loadSuccess,
});

const mapDispatch = dispatch => ({
    initConfiguration: dispatch.labelsEdit.initConfiguration,
});

export default connect(mapState, mapDispatch)(LabelEdit);
