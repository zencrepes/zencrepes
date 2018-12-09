import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

import LoadMessage from './LoadMessage.js';

const styles = theme => ({
    root: {
    },
});
class RefreshSnackbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, verifying, verifyingMsg, verifFlag } = this.props;

        if (verifFlag === false && verifying) {
            return (
                <div className={classes.root}>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        open={verifying}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={
                            <LoadMessage
                                message={verifyingMsg}
                            />
                        }
                    />
                </div>
            );
        } else {
            return null;
        }

    };
}

RefreshSnackbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    verifying: state.milestonesCreate.verifying,
    verifFlag: state.milestonesCreate.verifFlag,
    verifyingMsg: state.milestonesCreate.verifyingMsg,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(RefreshSnackbar));
