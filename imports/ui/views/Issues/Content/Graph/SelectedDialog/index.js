import React, { Component } from 'react';

import PropTypes from "prop-types";
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

class SelectedDialog extends Component {
    constructor(props) {
        super(props);

    }

    closeDialog = () => {
        const { setGraphNodeSelectedDialog, setGraphNodeSelected } = this.props;
        setGraphNodeSelectedDialog(false);
        setGraphNodeSelected({});
    };

    filterGraph = () => {
        const { setGraphNodeSelectedDialog, setGraphNodeSelected, graphNodeSelected, setUpdateQuery, setUpdateQueryPath, setGraphPathStart, setGraphPathEnd } = this.props;
        const query = {'id': {'$in': [graphNodeSelected.id()]}};
        setUpdateQuery(query);
        setUpdateQueryPath('/issues/graph');
        setGraphNodeSelectedDialog(false);
        setGraphNodeSelected({});
        setGraphPathStart({});
        setGraphPathEnd({});
    };

    setStart = () => {
        const { setGraphNodeSelectedDialog, setGraphNodeSelected, setGraphPathStart, graphNodeSelected } = this.props;
        setGraphPathStart(graphNodeSelected);
        setGraphNodeSelectedDialog(false);
        setGraphNodeSelected({});
    };

    setEnd = () => {
        const { setGraphNodeSelectedDialog, setGraphNodeSelected, setGraphPathEnd, graphNodeSelected } = this.props;
        setGraphPathEnd(graphNodeSelected);
        setGraphNodeSelectedDialog(false);
        setGraphNodeSelected({});
    };

    render() {
        const { graphNodeSelectedDialog } = this.props;
        return (
            <Dialog onClose={this.closeDialog} aria-labelledby="Node selected" open={graphNodeSelectedDialog}>
                <DialogTitle id="simple-dialog-title">Which action do you want to perform?</DialogTitle>
                <MenuList
                    id="simple-menu"
                    open={true}
                >
                    <MenuItem onClick={this.filterGraph}>Build new graph from selected node</MenuItem>
                    <MenuItem onClick={this.setStart}>Use node as Path start</MenuItem>
                    <MenuItem onClick={this.setEnd}>Use node as Path end</MenuItem>
                </MenuList>
            </Dialog>
        );
    }
}

SelectedDialog.propTypes = {
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,

    graphNodeSelectedDialog: PropTypes.bool.isRequired,
    graphNodeSelected: PropTypes.object.isRequired,

    setGraphNodeSelectedDialog: PropTypes.func.isRequired,
    setGraphNodeSelected: PropTypes.func.isRequired,
    setGraphPathStart: PropTypes.func.isRequired,
    setGraphPathEnd: PropTypes.func.isRequired,
};

const mapState = state => ({
    graphNodeSelectedDialog: state.issuesView.graphNodeSelectedDialog,
    graphNodeSelected: state.issuesView.graphNodeSelected,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,

    setGraphNodeSelectedDialog: dispatch.issuesView.setGraphNodeSelectedDialog,
    setGraphNodeSelected: dispatch.issuesView.setGraphNodeSelected,
    setGraphPathEnd: dispatch.issuesView.setGraphPathEnd,
    setGraphPathStart: dispatch.issuesView.setGraphPathStart,
});

export default connect(mapState, mapDispatch)(SelectedDialog);