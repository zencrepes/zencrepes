import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    root: {
        marginLeft: '5px',
    },
});


class Value extends Component {
    constructor (props) {
        super(props);
    }

    handleDelete = () => {
        const { currentFacet, value, updateQuery } = this.props;
        updateQuery(value, currentFacet);
    };

    render() {
        const { classes, value } = this.props;
        return (
            <Chip onDelete={this.handleDelete} variant="outlined" label={value} className={classes.root} />
        );
    }
}

Value.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Value);
