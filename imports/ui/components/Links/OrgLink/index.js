import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = {
    root: {
        textDecoration: 'none'
    },
};
class OrgLink extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, org } = this.props;

        return (
            <a
                href={org.url}
                rel="noopener noreferrer" target="_blank"
                className={classes.root}
            >
                {org.login}
                <OpenInNewIcon style={{fontSize: 12}}/>
            </a>
        )
    }
}

OrgLink.propTypes = {
    classes: PropTypes.object.isRequired,
    org: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrgLink);
