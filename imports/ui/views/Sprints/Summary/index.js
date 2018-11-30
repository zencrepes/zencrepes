import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from 'react-moment';
import ReactMarkdown from 'react-markdown';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import CustomCard from "../../../components/CustomCard/index.js";

import Edit from './Edit/index.js';
import CloseSprint from './CloseSprint.js';

const styles = theme => ({
    root: {
    }
});

class Summary extends Component {
    constructor(props) {
        super(props);
    }

    openEditSprint = () => {
        console.log('openEditSprint');
        const {
            setEditSprint,
            setEditSprintTitle,
            setEditSprintDescription,
            setEditSprintDueDate,
            selectedSprintDescription,
            selectedSprintTitle,
            selectedSprintDueDate,
        } = this.props;

        setEditSprintTitle(selectedSprintTitle);
        setEditSprintDescription(selectedSprintDescription);
        setEditSprintDueDate(selectedSprintDueDate);
        setEditSprint(true);
        console.log(this.props);
        console.log(this.props);
        console.log(this.props);
    };

    cancelEdit = () => {
        const { setEditSprint } = this.props;
        setEditSprint(false);
    };

    saveEdit = () => {
        console.log('cancelEdit');
    };

    render() {
        const {
            classes,
            selectedSprintDescription,
            selectedSprintTitle,
            selectedSprintDueDate,
            editSprint
        } = this.props;
        console.log(selectedSprintDescription);
        console.log(selectedSprintTitle);
        console.log(selectedSprintDueDate);
        console.log(editSprint);

        return (
            <CustomCard
                headerTitle={selectedSprintTitle}
                headerFactTitle="Due date"
                headerFactValue={<Moment format="ddd MMM D, YYYY">{selectedSprintDueDate}</Moment> }
            >
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm container>
                        {editSprint ? (
                            <Edit
                                saveEdit={this.saveEdit}
                                cancelEdit={this.cancelEdit}
                            />
                        ) : (
                            <ReactMarkdown source={selectedSprintDescription} />
                        )}
                    </Grid>
                    <Grid item >
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                        {!editSprint &&
                            <Grid item >
                                <Button variant="raised" color="primary" onClick={this.openEditSprint} autoFocus>
                                    Edit Sprint
                                </Button>
                            </Grid>
                        }
                            <Grid item >
                                <CloseSprint />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CustomCard>
        );
    }
}

Summary.propTypes = {
    classes: PropTypes.object,
};

const mapDispatch = dispatch => ({
    setEditSprint: dispatch.sprintsView.setEditSprint,
    setEditSprintTitle: dispatch.sprintsView.setEditSprintTitle,
    setEditSprintDescription: dispatch.sprintsView.setEditSprintDescription,
    setEditSprintDueDate: dispatch.sprintsView.setEditSprintDueDate,
});

const mapState = state => ({
    editSprint: state.sprintsView.editSprint,
    selectedSprintDescription: state.sprintsView.selectedSprintDescription,
    selectedSprintTitle: state.sprintsView.selectedSprintTitle,
    selectedSprintDueDate: state.sprintsView.selectedSprintDueDate,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Summary));
