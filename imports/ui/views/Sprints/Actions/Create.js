import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        textAlign: 'right',
    },
});

class Create extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    openEditSprint = () => {
        console.log('openEditSprint');
        const {
            setEditSprint,
            setEditSprintTitle,
            setEditSprintDescription,
            setEditSprintDueDate,
        } = this.props;

        setEditSprintTitle('New Sprint');
        setEditSprintDescription('');
        setEditSprintDueDate(new Date());
        setEditSprint(true);
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button variant="raised" color="primary" className={classes.button} onClick={this.openEditSprint}>
                    Create New Sprint
                </Button>
            </div>
        )
    };
}

Create.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    setEditSprint: dispatch.sprintsView.setEditSprint,
    setEditSprintTitle: dispatch.sprintsView.setEditSprintTitle,
    setEditSprintDescription: dispatch.sprintsView.setEditSprintDescription,
    setEditSprintDueDate: dispatch.sprintsView.setEditSprintDueDate,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Create));
