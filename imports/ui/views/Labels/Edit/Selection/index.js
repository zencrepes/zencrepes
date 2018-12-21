import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';
import CustomCard from "../../../../components/CustomCard";

const styles = theme => ({
    root: {
    },
});
class EditSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    addToSelected() {
        const { addToSelected } = this.props;
        addToSelected();
    }

    removeFromSelected() {
        const { addToAvailable } = this.props;
        addToAvailable();
    }

    // Subtitle is currently not being displayed
    render() {
        const { classes, selectedRepos, allRepos, updateSelectedRepos } = this.props;
        return (
            <CustomCard
                headerTitle="Select Repositories"
                headerFactTitle=""
                headerFactValue=""
                headerSubtitle="Changes will be applied only to selected repositories"
            >
                <DualListBox
                    canFilter
                    options={allRepos}
                    selected={selectedRepos}
                    onChange={(selected) => {
                        updateSelectedRepos(selected);
                    }}
                />
            </CustomCard>
        );
    }
}

EditSelection.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    selectedRepos: state.labelsEdit.selectedRepos,
    allRepos: state.labelsEdit.allRepos,
});

const mapDispatch = dispatch => ({
    updateSelectedRepos: dispatch.labelsEdit.updateSelectedRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(EditSelection));