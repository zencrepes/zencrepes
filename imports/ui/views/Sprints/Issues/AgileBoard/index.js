import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Issue from './Issue/index.js';
import List from './List/index.js';
import Column from './Column/index.js';

/*
const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'content task 1'},
        'task-2': { id: 'task-2', content: 'content task 2'},
        'task-3': { id: 'task-3', content: 'content task 3'},
        'task-4': { id: 'task-4', content: 'content task 4'},
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To-Do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
    },
    columnOrder: ['column-1'],
};
*/
class AgileBoard extends Component {
    constructor(props) {
        super(props);
    }

    onDragEnd = result => {
        // ToDo - Reorder our column
        return result;
    };

    setInitialData = (issues) => {
        const allIssues = issues.reduce((obj, item) => {
                obj[item['id']] = item
                return obj
            }, {});
        return {
            issues: allIssues,
            columns: {
                'unassigned': {
                    id: 'unassigned',
                    title: 'Open',
                    issueIds: issues.filter(issue => issue.state === 'OPEN').map(issue => issue.id),
                },
                'closed': {
                    id: 'closed',
                    title: 'Closed',
                    issueIds: issues.filter(issue => issue.state === 'CLOSED').map(issue => issue.id),
                },
            },
            columnOrder: ['unassigned', 'closed'],
        }
    };

    render() {
        const { issues } = this.props;
        const initialData = this.setInitialData(issues);
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    {initialData.columnOrder.map((columnId) => {
                        const column = initialData.columns[columnId];
                        const issues = column.issueIds.map(issueId => initialData.issues[issueId]);
                        return (
                            <Grid item key={column.id}>
                                <Column column={column}>
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
                            </Grid>
                        );
                    })}
                </Grid>
            </DragDropContext>
        );
    }
}

AgileBoard.propTypes = {
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.sprintsView.issues,
});

export default connect(mapState, null)(AgileBoard);

/*

    render() {
        const { issues } = this.props;
        console.log(issues);
        const initialData = this.setInitialData(issues);
        console.log(initialData);
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {initialData.columnOrder.map((columnId) => {
                    const column = initialData.columns[columnId];
                    const issues = column.issueIds.map(issueId => initialData.issues[issueId]);
                    return (
                        <React.Fragment key={column.id}>
                            <h3>{column.title}</h3>
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
                        </React.Fragment>
                    );
                })}
            </DragDropContext>
        );
    }
 */