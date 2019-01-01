import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';

class MilestoneTitle extends Component {
    constructor (props) {
        super(props);
    }

    changeSprintName = (event) => {
        const { setEditMilestoneTitle } = this.props;
        setEditMilestoneTitle(event.target.value);
    };

    render() {
        const { editMilestoneTitle } = this.props;
        return (
            <TextField
                id="outlined-full-width"
                label="Milestone Title"
                style={{ margin: 8 }}
                placeholder=""
                fullWidth
                value={editMilestoneTitle}
                onChange={this.changeSprintName}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        );
    }
}

MilestoneTitle.propTypes = {
    setEditMilestoneTitle: PropTypes.func.isRequired,
    editMilestoneTitle: PropTypes.string.isRequired,
};

const mapDispatch = dispatch => ({
    setEditMilestoneTitle: dispatch.milestonesEdit.setEditMilestoneTitle,
});

const mapState = state => ({
    editMilestoneTitle: state.milestonesEdit.editMilestoneTitle,
});

export default connect(mapState, mapDispatch)(MilestoneTitle);