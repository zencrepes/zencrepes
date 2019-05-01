import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = {
    root: {
        textDecoration: 'none'
    },
};
class IssueLink extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, issue } = this.props;

        return (
            <a
                href={issue.url}
                rel="noopener noreferrer" target="_blank"
                className={classes.root}
            >
                {issue.title}
                <OpenInNewIcon style={{fontSize: 12}}/>
            </a>
        )
    }
}

IssueLink.propTypes = {
    classes: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
};

export default withStyles(styles)(IssueLink);
