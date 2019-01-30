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
        const { label, labels, setLabels, verifiedLabels, setVerifiedLabels } = this.props;
        setLabels(
            labels.filter(ms => ms.id !== label.id)
        );
        setVerifiedLabels(
            verifiedLabels.filter(ms => ms.id !== label.id)
        );
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
    verifiedLabels: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    label: PropTypes.object.isRequired,

    setLabels: PropTypes.func.isRequired,
    setVerifiedLabels: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedLabels: state.labelsEdit.verifiedLabels,
    labels: state.labelsEdit.labels,
});

const mapDispatch = dispatch => ({
    setLabels: dispatch.labelsEdit.setLabels,
    setVerifiedLabels: dispatch.labelsEdit.setVerifiedLabels,
});

export default connect(mapState, mapDispatch)(RemoveButton);
