import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Issue from './Issue/index.js';
import List from './List/index.js';
import Column from './Column/index.js';

class AgileBoard extends Component {
    constructor(props) {
        super(props);
    }

    onDragEnd = result => {
        const {
            issues,
            setIssues,
            setAction,
            setVerifFlag,
            setOnSuccess,
            updateView,
            agileBoardLabels,
            setAgileLabels,
            setAgileNewState,
            log,
        } = this.props;

        // ToDo - Reorder our column
        log.info(result);

        // If drag and drop in the same column, no action taken
        if (result.destination !== null && result.destination.droppableId !== result.source.droppableId) {
            const sourceId = result.draggableId;
            const destinationLabel = result.destination.droppableId;
            //const sourceLabel = result.source.droppableId;

            const issue = issues.find(iss => iss.id === sourceId);
            // Only process if issue is found
            if (issue !== undefined) {
                setAgileNewState(destinationLabel);
                setIssues([issue]);
                setAgileLabels(agileBoardLabels.filter(lbl => lbl.repo.id === issue.repo.id));
                setAction('updateStateLabel');
                setOnSuccess(updateView);
                setVerifFlag(true);
            }
        }

        return result;
    };

    render() {
        const { agileBoardData } = this.props;
        const initialData = agileBoardData;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                    wrap="nowrap"
                >
                    {initialData.columnOrder.map((columnId) => {
                        const column = initialData.columns[columnId];
                        const issues = column.issueIds.map(issueId => initialData.issues[issueId]);
                        return (
                            <Grid item xs key={column.id}>
                                <Column column={column}>
                                    <Droppable droppableId={column.id}>
                                        {provided => (
                                            <React.Fragment>
                                            <List provided={provided} innerRef={provided.innerRef}>
                                                {issues.map(issue => (
                                                    <React.Fragment key={issue.id}>
                                                        <Draggable draggableId={issue.id} index={0}>
                                                            {provided => (
                                                                <Issue issue={issue} provided={provided} innerRef={provided.innerRef} />
                                                            )}
                                                        </Draggable>
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                            {provided.placeholder}
                                            </React.Fragment>
                                        )}
                                    </Droppable>
                                </Column>
                            </Grid>
                        );
                    })}
                </Grid>
            </DragDropContext>
        );

        /*
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {initialData.columnOrder.map((columnId) => {
                                const column = initialData.columns[columnId];
                                return (
                                    <TableCell component="th" scope="row" key={column.id}>
                                        {column.title}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {initialData.columnOrder.map((columnId) => {
                                const column = initialData.columns[columnId];
                                const issues = column.issueIds.map(issueId => initialData.issues[issueId]);
                                return (
                                    <Column column={column} key={column.id}>
                                        <Droppable droppableId={column.id}>
                                            {provided => (
                                                <List provided={provided} innerRef={provided.innerRef}>
                                                    {issues.map(issue => (
                                                        <React.Fragment key={issue.id}>
                                                            <Draggable draggableId={issue.id} index={0}>
                                                                {provided => (
                                                                    <Issue issue={issue} provided={provided} innerRef={provided.innerRef} />
                                                                )}
                                                            </Draggable>
                                                        </React.Fragment>
                                                    ))}
                                                    {provided.placeholder}
                                                </List>
                                            )}
                                        </Droppable>
                                    </Column>
                                );
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </DragDropContext>
        );
        */
    }
}

AgileBoard.propTypes = {
    issues: PropTypes.array.isRequired,
    agileBoardData: PropTypes.object.isRequired,
    agileBoardLabels: PropTypes.array.isRequired,

    setAction: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setIssues: PropTypes.func.isRequired,
    setAgileLabels: PropTypes.func.isRequired,
    setAgileNewState: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    
    log: PropTypes.object.isRequired,
};

const mapState = state => ({
    issues: state.sprintsView.issues,
    agileBoardData: state.sprintsView.agileBoardData,
    agileBoardLabels: state.sprintsView.agileBoardLabels,

    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setAction: dispatch.issuesEdit.setAction,
    setVerifFlag: dispatch.issuesEdit.setVerifFlag,
    setStageFlag: dispatch.issuesEdit.setStageFlag,
    setLoadFlag: dispatch.issuesEdit.setLoadFlag,
    setIssues: dispatch.issuesEdit.setIssues,
    setAgileLabels: dispatch.issuesEdit.setAgileLabels,
    setAgileNewState: dispatch.issuesEdit.setAgileNewState,

    updateView: dispatch.sprintsView.updateView,
    setOnSuccess: dispatch.loading.setOnSuccess,
});


export default connect(mapState, mapDispatch)(AgileBoard);