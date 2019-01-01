import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = {
    root: {
        marginLeft: '5px',
    },
};

class Value extends Component {
    constructor (props) {
        super(props);
    }

    handleDelete = () => {
        const { currentFacet, value, updateQuery } = this.props;
        updateQuery(value, currentFacet);
    };

    render() {
        const { classes, value, updateQuery } = this.props;
        if (updateQuery === null) {
            return (
                <Chip variant="outlined" label={value} className={classes.root} />
            );
        } else {
            return (
                <Chip onDelete={this.handleDelete} variant="outlined" label={value} className={classes.root} />
            );

        }
    }
}

Value.propTypes = {
    classes: PropTypes.object.isRequired,
    currentFacet: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired,
};

export default withStyles(styles)(Value);
