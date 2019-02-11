import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';

class Title extends Component {
    constructor (props) {
        super(props);
    }

    changeMilestoneTitle = (event) => {
        const { setNewTitle } = this.props;
        setNewTitle(event.target.value);
    };

    render() {
        const { newTitle } = this.props;

        return (
            <TextField
                id="outlined-full-width"
                label="Milestone Title"
                style={{ margin: 8 }}
                placeholder=""
                fullWidth
                value={newTitle}
                onChange={this.changeMilestoneTitle}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        );
    }
}

Title.propTypes = {
    newTitle: PropTypes.string.isRequired,
    setNewTitle: PropTypes.func.isRequired,
};

const mapState = state => ({
    newTitle: state.milestonesEdit.newTitle,
});

const mapDispatch = dispatch => ({
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
});

export default connect(mapState, mapDispatch)(Title);