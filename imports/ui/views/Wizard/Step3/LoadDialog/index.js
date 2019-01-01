import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import ApplyButton from './ApplyButton.js';
import CancelButton from './CancelButton.js';

class LoadDialog extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { reposIssues } = this.props;

        return (
            <Dialog aria-labelledby="simple-dialog-title" open={true}>
                <DialogTitle id="simple-dialog-title">Load issues ?</DialogTitle>
                <DialogContent>
                    {reposIssues === 0 ? (
                        <React.Fragment>
                            Please select a repository with issues.
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            Do you want to load the {reposIssues} issues attached to the selected repositories ?<br />
                        </React.Fragment>
                    )}
                </DialogContent>
                <DialogActions>
                    {reposIssues !== 0 &&
                        <CancelButton />
                    }
                    <ApplyButton />
                </DialogActions>
            </Dialog>
        );
    }
}

LoadDialog.propTypes = {
    reposIssues: PropTypes.number.isRequired,
};

const mapState = state => ({
    reposIssues: state.wizardView.reposIssues,
});

export default connect(mapState, null)(LoadDialog);
