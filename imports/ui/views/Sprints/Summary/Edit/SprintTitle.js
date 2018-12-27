import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';

class SprintTitle extends Component {
    constructor (props) {
        super(props);
    }

    changeSprintName = name => event => {
        const { setEditSprintTitle } = this.props;
        setEditSprintTitle(event.target.value);
    };

    render() {
        const { editSprintTitle } = this.props;

        return (
            <TextField
                id="outlined-full-width"
                label="Sprint Title"
                style={{ margin: 8 }}
                placeholder=""
                fullWidth
                value={editSprintTitle}
                onChange={this.changeSprintName()}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        );
    }
}

SprintTitle.propTypes = {
    editSprintTitle: PropTypes.string.isRequired,
    setEditSprintTitle: PropTypes.func.isRequired,
};

const mapState = state => ({
    editSprintTitle: state.sprintsView.editSprintTitle,
});

const mapDispatch = dispatch => ({
    setEditSprintTitle: dispatch.sprintsView.setEditSprintTitle,
});

export default connect(mapState, mapDispatch)(SprintTitle);