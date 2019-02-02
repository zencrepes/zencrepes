import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class CancelButton extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        const { setOpenEditDialog } = this.props;
        setOpenEditDialog(false);
    };

    render() {
        return (
            <Button onClick={this.cancel} color="primary" autoFocus>
                Cancel
            </Button>
        );
    }
}

CancelButton.propTypes = {
    setOpenEditDialog: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setOpenEditDialog: dispatch.milestonesEdit.setOpenEditDialog,
});

export default connect(null, mapDispatch)(CancelButton);