import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import LabelColor from './Color.js';
import LabelName from './Name.js';
import LabelDescription from './Description.js';
import DeleteWarning from './DeleteWarning.js';

import CustomCard from "../../../../components/CustomCard";

class EditActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteWarning: false,
        };
    }

    clickSaveLabels() {
        const { setLoadFlag, setAction } = this.props;
        setLoadFlag(true);
        setAction('update');
    }

    clickDeleteLabels() {
        const { setDeleteWarning } = this.props;
        setDeleteWarning(true);
    }

    render() {
        return (
            <CustomCard
                headerTitle="Actions"
                headerFactTitle=""
                headerFactValue=""
                headerSubtitle="Apply the following actions to all selected repositories"
            >
                <DeleteWarning />
                <List component="nav">
                    <LabelName />
                    <Divider />
                    <LabelColor />
                    <Divider />
                    <LabelDescription />
                    <Divider />
                    <Button variant="outlined" color="primary" onClick={() => this.clickSaveLabels()}>
                        Save
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => this.clickDeleteLabels()}>
                        Delete Label
                    </Button>
                </List>
            </CustomCard>
        );
    }
}

EditActions.propTypes = {
    setLoadFlag: PropTypes.func.isRequired,
    setDeleteWarning: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsEdit.setLoadFlag,
    setDeleteWarning: dispatch.labelsEdit.setDeleteWarning,
    setAction: dispatch.labelsEdit.setAction
});

export default connect(null, mapDispatch)(EditActions);