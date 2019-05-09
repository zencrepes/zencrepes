import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {connect} from "react-redux";

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

class TimeModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedField: 'createdAt',
            direction: 'before',
            date: new Date()
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleChangeDate = name => event => {
        this.setState({ [name]: event });
    };

    handleClose = () => {
        const { setShowTimeModal } = this.props;
        setShowTimeModal(false);
        this.initState();
    };

    handleAdd = () => {
        const { setShowTimeModal, addRemoveDateQuery } = this.props;
        let selectedDate = startOfDay(this.state.date);
        if (this.state.direction === 'before') {
            selectedDate = endOfDay(this.state.date);
        }
        addRemoveDateQuery(this.state.selectedField, this.state.direction, selectedDate.toISOString());
        setShowTimeModal(false);
        this.initState();
    };

    initState = () => {
        this.setState({
            selectedField: 'createdAt',
            direction: 'before',
            date: new Date()
        })
    };

    render() {
        const { showTimeModal, setShowTimeModal, timeFields, classes } = this.props;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={showTimeModal}
                onClose={() => {setShowTimeModal(false);}}
            >
                <DialogTitle>Add a date filter</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-simple">Field</InputLabel>
                            <Select
                                native
                                value={this.state.selectedField}
                                onChange={this.handleChange('selectedField')}
                                input={<Input id="age-native-simple" />}
                            >
                                {timeFields.map(field => (<option key={field.idx} value={field.idx}>{field.name}</option>))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-simple">Direction</InputLabel>
                            <Select
                                native
                                value={this.state.direction}
                                onChange={this.handleChange('direction')}
                                input={<Input id="age-native-simple" />}
                            >
                                <option value={'before'}>before</option>
                                <option value={'after'}>after</option>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    autoOk
                                    label="Date"
                                    emptyLabel="Not Set"
                                    clearable
                                    value={this.state.date}
                                    onChange={this.handleChangeDate('date')}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleAdd} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}


TimeModal.propTypes = {
    classes: PropTypes.object.isRequired,
    showTimeModal: PropTypes.bool.isRequired,
    addRemoveDateQuery: PropTypes.func.isRequired,
    timeFields: PropTypes.array.isRequired,
    setShowTimeModal: PropTypes.func.isRequired,
};

const mapState = state => ({
    showTimeModal: state.issuesView.showTimeModal,
    timeFields: state.issuesView.timeFields,
});

const mapDispatch = dispatch => ({
    setShowTimeModal: dispatch.issuesView.setShowTimeModal,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(TimeModal));