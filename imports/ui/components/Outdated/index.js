import React from 'react';

import {connect} from "react-redux";
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Outdated extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { checkData } = this.props;
        checkData();
    }

    handleClose = () => {
        const { setDataRefresh } = this.props;
        setDataRefresh(false);
    };

    handleClear = () => {
        const { clearData } = this.props;
        clearData();
    };

    render() {
        const { dataRefresh } = this.props;

        return (
            <Dialog
                open={dataRefresh}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"ZenCrepes data model has changed !"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We are doing our best to avoid disruption, but as we add new features, we sometime need to modify ZenCrepes data model. <br /><br />
                        Data from an old model has been detected, to avoid UI crashes, please click on &apos;Clear Data&apos; and refresh this page.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClear} color="primary">
                        Clear Data
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                        Not Yet!
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
Outdated.propTypes = {
    dataRefresh: PropTypes.bool.isRequired,
    clearData: PropTypes.func.isRequired,
    checkData: PropTypes.func.isRequired,
    setDataRefresh: PropTypes.func.isRequired,
};

const mapState = state => ({
    dataRefresh: state.global.dataRefresh,
});

const mapDispatch = dispatch => ({
    clearData: dispatch.global.clearData,
    checkData: dispatch.global.checkData,
    setDataRefresh: dispatch.global.setDataRefresh,
});

export default connect(mapState, mapDispatch)(Outdated);
