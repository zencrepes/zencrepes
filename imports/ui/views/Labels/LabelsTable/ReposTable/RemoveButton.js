import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

class RemoveButton extends Component {
    constructor (props) {
        super(props);
    }

    remove = () => {
        const { label, setLabels, setAction, setOnSuccess, updateView, setStageFlag, setVerifFlag} = this.props;
        setLabels([label]);
        setAction('delete');
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        return (
            <IconButton aria-label="Delete" onClick={this.remove}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        );
    }
}

RemoveButton.propTypes = {
    label: PropTypes.object.isRequired,

    setLabels: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.labelsEdit.setVerifFlag,
    setAction: dispatch.labelsEdit.setAction,
    setStageFlag: dispatch.labelsEdit.setStageFlag,
    updateView: dispatch.labelsView.updateView,
    setLabels: dispatch.labelsEdit.setLabels,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(RemoveButton);
