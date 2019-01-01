import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';
import CustomCard from "../../../../components/CustomCard";

class EditSelection extends Component {
    constructor(props) {
        super(props);
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
        const { selectedRepos, allRepos, updateSelectedRepos } = this.props;
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
    selectedRepos: PropTypes.array.isRequired,
    allRepos: PropTypes.array.isRequired,
    updateSelectedRepos: PropTypes.func.isRequired,

    addToSelected: PropTypes.func.isRequired,
    addToAvailable: PropTypes.func.isRequired,
};

const mapState = state => ({
    selectedRepos: state.labelsEdit.selectedRepos,
    allRepos: state.labelsEdit.allRepos,
});

const mapDispatch = dispatch => ({
    updateSelectedRepos: dispatch.labelsEdit.updateSelectedRepos,
});

export default connect(mapState, mapDispatch)(EditSelection);