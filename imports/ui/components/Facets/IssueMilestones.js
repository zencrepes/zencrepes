import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class IssueMilestones extends Component {

    render() {
        const { classes, theme } = this.props;

        return (
            <h3>Issue Milestones</h3>
        );
    }
}

IssueMilestones.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(IssueMilestones);
