import _ from 'lodash';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
    }
});

class SprintEndDate extends Component {
    constructor (props) {
        super(props);
    }

    changeSprintEndDate = name => event => {
        const { setCreateSprintEndDate } = this.props;
        let newSprintEndDate = event.target.value;
        console.log(newSprintEndDate);
        setCreateSprintEndDate(newSprintEndDate);
    };

    render() {
        const { classes, setCreateSprintEndDate } = this.props;
        let twoWeeksFromNow = new Date(new Date().getTime() + (15*24*60*60*1000));
        let formattedSprintEndDate = twoWeeksFromNow.getFullYear() + "-" + (twoWeeksFromNow.getMonth()+1 < 10 ? '0' : '') + (twoWeeksFromNow.getMonth()+1) + "-" + (twoWeeksFromNow.getDate() < 10 ? '0' : '') + (twoWeeksFromNow.getDate());
        setCreateSprintEndDate(formattedSprintEndDate);
        return (
            <div className={classes.root}>
                <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    defaultValue={formattedSprintEndDate}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={this.changeSprintEndDate()}
                />
            </div>
        );
    };
}

SprintEndDate.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    setCreateSprintEndDate: dispatch.sprintPlanning.setCreateSprintEndDate

});

export default connect(mapState, mapDispatch)(withStyles(styles)(SprintEndDate));
