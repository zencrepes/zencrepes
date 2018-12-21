import _ from 'lodash';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
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

class SprintName extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sprintNameValue: '',
            sprintNameError: false,
            sprintNameHelperText: 'Pick a name for your Sprint',
        };
    }

    changeSprintName = name => event => {
        const { availableSprints, setCreateSprintName } = this.props;
        let newSprintName = event.target.value;
        if (_.findIndex(availableSprints, (sprint) => { return sprint.toLowerCase() === newSprintName.toLowerCase(); }) !== -1) {
            this.setState({
                ['sprintNameError']: true,
                ['sprintNameValue']: newSprintName,
                ['sprintNameHelperText']: 'A sprint with this name already exists',
            });
            setCreateSprintName('');
        } else {
            this.setState({
                ['sprintNameError']: false,
                ['sprintNameValue']: newSprintName,
                ['sprintNameHelperText']: 'Pick a name for your Sprint',
            });
            setCreateSprintName(newSprintName);
        }
    };

    render() {
        const { classes } = this.props;
        const { sprintNameError, sprintNameHelperText } = this.state;

        return (
            <div className={classes.root}>
                <TextField
                    id="full-width"
                    label="Name"
                    error={sprintNameError}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.textField}
                    helperText={sprintNameHelperText}
                    fullWidth
                    margin="normal"
                    onChange={this.changeSprintName()}
                />
            </div>
        );
    };
}

SprintName.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    availableSprints: state.sprintsView.availableSprints,
});

const mapDispatch = dispatch => ({
    setCreateSprintName: dispatch.sprintsView.setCreateSprintName

});

export default connect(mapState, mapDispatch)(withStyles(styles)(SprintName));
