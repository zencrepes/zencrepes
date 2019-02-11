import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import Description from './Description.js';
import DueOn from './DueOn.js';
import Title from './Title.js';
import CancelButton from './CancelButton.js';
import SaveButton from './SaveButton.js';

import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";

class MilestonesEditDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            openEditDialog
        } = this.props;

        return (
            <Dialog
                aria-labelledby="simple-dialog-title"
                fullWidth={true}
                maxWidth="lg"
                open={openEditDialog}
            >
                <DialogContent>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm container>
                            <Title />
                        </Grid>
                        <Grid item >
                            <DueOn />
                        </Grid>
                    </Grid>
                    <Description />
                </DialogContent>
                <DialogActions>
                    <CancelButton />
                    <SaveButton />
                </DialogActions>
            </Dialog>
        );
    }
}

MilestonesEditDialog.propTypes = {
    openEditDialog: PropTypes.bool.isRequired,
};

const mapState = state => ({
    openEditDialog: state.milestonesEdit.openEditDialog,
});

export default connect(mapState, null)(MilestonesEditDialog);
