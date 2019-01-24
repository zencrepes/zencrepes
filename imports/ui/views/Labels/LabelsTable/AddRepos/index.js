import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';
import Typography from "@material-ui/core/Typography/Typography";

class AddRepos extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        const { setOpenAddRepos } = this.props;
        setOpenAddRepos(false);
    };

    apply = () => {
        const {
            setOpenAddRepos,
            setVerifFlag,
            setAction,
            setOnSuccess,
            setVerifying,
            setStageFlag,
            updateView
        } = this.props;

        setOpenAddRepos(false);
        setAction('create');
        setOnSuccess(updateView);
        setVerifying(true);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { openAddRepos, addReposAvailable, addReposSelected, addRepoUpdateSelected, newName } = this.props;

        if (openAddRepos) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openAddRepos}>
                    <DialogTitle id="simple-dialog-title">Add {newName}</DialogTitle>
                    <DialogContent>
                        <Typography color="textSecondary">
                            Please select repositories this label should be added to
                        </Typography>
                        <DualListBox
                            canFilter
                            options={addReposAvailable}
                            selected={addReposSelected}
                            onChange={(selected) => {
                                addRepoUpdateSelected(selected);
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancel} color="primary" autoFocus>
                            Cancel
                        </Button>
                        {addReposSelected.length >0 &&
                            <Button onClick={this.apply} color="primary" autoFocus>
                                Apply
                            </Button>
                        }
                    </DialogActions>
                </Dialog>
            );
        } else {
            return null;
        }
    }
}

AddRepos.propTypes = {
    openAddRepos: PropTypes.bool.isRequired,
    addReposAvailable: PropTypes.array.isRequired,
    addReposSelected: PropTypes.array.isRequired,
    newName: PropTypes.string.isRequired,

    setOpenAddRepos: PropTypes.func.isRequired,
    addRepoUpdateSelected: PropTypes.func.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    openAddRepos: state.labelsEdit.openAddRepos,

    addReposAvailable: state.labelsEdit.addReposAvailable,
    addReposSelected: state.labelsEdit.addReposSelected,
    newName: state.labelsEdit.newName,
});

const mapDispatch = dispatch => ({
    setOpenAddRepos: dispatch.labelsEdit.setOpenAddRepos,
    addRepoUpdateSelected: dispatch.labelsEdit.addRepoUpdateSelected,

    setVerifFlag: dispatch.labelsEdit.setVerifFlag,
    setAction: dispatch.labelsEdit.setAction,
    setOnSuccess: dispatch.labelsEdit.setOnSuccess,
    setVerifying: dispatch.labelsEdit.setVerifying,
    setStageFlag: dispatch.labelsEdit.setStageFlag,
    updateView: dispatch.labelsView.updateView,
});

export default connect(mapState, mapDispatch)(AddRepos);
