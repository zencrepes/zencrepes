import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        const { setEditSprint } = this.props;
        setEditSprint(false);
    };

    render() {
        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button onClick={this.cancel} color="primary" autoFocus>
                Cancel
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    setEditSprint: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setEditSprint: dispatch.sprintsView.setEditSprint,
});

export default connect(null, mapDispatch)(ApplyButton);