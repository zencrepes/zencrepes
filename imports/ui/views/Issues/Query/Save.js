import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';


const styles = theme => ({
    root: {
    },
});
class Save extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, onClick, query, queries } = this.props;

        let disabled = false;
        if (queries.filter((currentQuery) => currentQuery.filters === JSON.stringify(query)).length > 0) {
            disabled = true;
        }

        return (
            <IconButton disabled={disabled} className={classes.button} aria-label="Open" onClick={onClick}>
                <SaveIcon />
            </IconButton>
        )

    };
}

Save.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Save);
