import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = {
    root: {
        textDecoration: 'none'
    },
};
class MilestoneLink extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, milestone } = this.props;

        return (
            <a
                href={milestone.url}
                rel="noopener noreferrer" target="_blank"
                className={classes.root}
            >
                {milestone.title}
                <OpenInNewIcon style={{fontSize: 12}}/>
            </a>
        )
    }
}

MilestoneLink.propTypes = {
    classes: PropTypes.object.isRequired,
    milestone: PropTypes.object.isRequired,
};

export default withStyles(styles)(MilestoneLink);
