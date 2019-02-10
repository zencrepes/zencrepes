import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class SaveButton extends Component {
    constructor (props) {
        super(props);
    }

    save = () => {
        const {
            setStageFlag,
            setVerifFlag,
            setOpenEditDialog,
        } = this.props;
        setStageFlag(true);
        setVerifFlag(true);
        setOpenEditDialog(false);
    };

    render() {
        return (
            <Button onClick={this.save} color="primary" autoFocus>
                Save
            </Button>
        );
    }
}

SaveButton.propTypes = {
    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setOpenEditDialog: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setOpenEditDialog: dispatch.milestonesEdit.setOpenEditDialog,
});

export default connect(null, mapDispatch)(SaveButton);