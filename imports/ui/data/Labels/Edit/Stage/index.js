import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import SquareIcon from 'mdi-react/SquareIcon';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import StageTable from './StageTable/index.js';

import ApplyButton from './ApplyButton.js';
import CancelButton from './CancelButton.js';

const styles = {
    root: {
        width: '90%'
    },
    table: {
        width: '50%',
    },
};
class Stage extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, stageFlag, labels, action, newName, newDescription, newColor } = this.props;
        return (
            <div className={classes.root}>
                <Dialog fullScreen aria-labelledby="simple-dialog-title" open={stageFlag}>
                    <DialogTitle id="simple-dialog-title">Review changes</DialogTitle>
                    <DialogContent>
                        {(action === 'update' || action === 'create') &&
                            <React.Fragment>
                                <Typography variant="body1" gutterBottom>
                                    The following values have been staged for update in GitHub
                                </Typography>
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                Name
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                Color
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                Description
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {newName}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1" gutterBottom>
                                                    <SquareIcon color={'#' + newColor} /> ({'#' + newColor})
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {newDescription}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </React.Fragment>
                        }
                        <Typography variant="body1" gutterBottom>
                            All nodes listed below will be updated. ZenCrepes will only allow you to apply changes if GitHub&apos;s data is in-sync with Zencrepes. If not, click on Cancel, verify the data (Zencrepes will have pulled the latest data automatically), then request the modification again.
                        </Typography>
                        <StageTable
                            labels={labels}
                            action={action}
                        />
                    </DialogContent>
                    <DialogActions>
                        <CancelButton />
                        <ApplyButton />
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Stage.propTypes = {
    classes: PropTypes.object.isRequired,
    stageFlag: PropTypes.bool.isRequired,
    labels: PropTypes.array.isRequired,
    action: PropTypes.string,

    setStageFlag: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,

    newName: PropTypes.string.isRequired,
    newDescription: PropTypes.string.isRequired,
    newColor: PropTypes.string.isRequired,
};

const mapState = state => ({
    stageFlag: state.labelsEdit.stageFlag,
    labels: state.labelsEdit.labels,
    action: state.labelsEdit.action,

    newName: state.labelsEdit.newName,
    newDescription: state.labelsEdit.newDescription,
    newColor: state.labelsEdit.newColor,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.labelsEdit.setStageFlag,
    setLabels: dispatch.labelsEdit.setLabels,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Stage));
