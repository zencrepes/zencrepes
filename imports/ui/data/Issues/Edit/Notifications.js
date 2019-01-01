import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

const styles = {
    root: {
        textAlign: 'right'
    },
};
class Notifications extends Component {
    constructor (props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        const { verifySuccess, setVerifySuccess } = this.props;
        if (prevProps.verifySuccess === false && verifySuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setVerifySuccess(false);
            }, 2000);
        }
    }

    render() {
        const { classes, verifySuccess, verifiedIssues } = this.props;

        if (verifySuccess) {
            let updatedIssues = verifiedIssues.filter(issue => issue.updated === true).length;
            return (
                <div className={classes.root}>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        open={verifySuccess}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Updated data for {updatedIssues} issues</span>}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
}

Notifications.propTypes = {
    classes: PropTypes.object.isRequired,
    verifySuccess: PropTypes.bool,
    verifiedIssues: PropTypes.array,
    setVerifySuccess: PropTypes.func,
};

const mapState = state => ({
    verifySuccess: state.issuesEdit.verifySuccess,
    verifiedIssues: state.issuesEdit.verifiedIssues,
});

const mapDispatch = dispatch => ({
    setVerifySuccess: dispatch.issuesEdit.setVerifySuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Notifications));
