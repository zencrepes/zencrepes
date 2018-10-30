import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class General extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, selectedTab } = this.props;
        return (
            <div className={classes.root}>
                <h1>General Layout</h1>
            </div>
        );
    }
}

General.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IssuesTabs);
