import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import ApplyButton from './ApplyButton.js';
import CancelButton from './CancelButton.js';

const styles = theme => ({
    root: {
    },
});
class LoadDialog extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, reposIssues } = this.props;

        return (
            <div className={classes.root}>
                <Dialog aria-labelledby="simple-dialog-title" open={true}>
                    <DialogTitle id="simple-dialog-title">Load issues ?</DialogTitle>
                    <DialogContent>
                        {reposIssues === 0 ? (
                            <React.Fragment>
                                You haven't selected repositories, or the repositories you have selected do not contain any issues.
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                Do you want to load issues attached to the selected repositories ?<br />
                                This will likely load {reposIssues} issues.
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
            </div>
        );
    };
}

LoadDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    reposIssues: state.wizardView.reposIssues,
});

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadDialog));
