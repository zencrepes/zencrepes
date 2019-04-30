import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = {
    root: {
        textDecoration: 'none'
    },
};
class LabelLink extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, label } = this.props;

        return (
            <a
                href={label.url}
                rel="noopener noreferrer" target="_blank"
                className={classes.root}
            >
                {label.name}
                <OpenInNewIcon style={{fontSize: 12}}/>
            </a>
        )
    }
}

LabelLink.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.object.isRequired,
};

export default withStyles(styles)(LabelLink);
