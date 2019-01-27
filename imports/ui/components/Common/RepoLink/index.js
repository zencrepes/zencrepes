import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = {
    root: {
        textDecoration: 'none'
    },
};
class RepoLink extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, repo } = this.props;
        return (
            <a
                href={repo.url}
                rel="noopener noreferrer" target="_blank"
                className={classes.root}
            >
                {repo.name}
                <OpenInNewIcon style={{fontSize: 12}}/>
            </a>
        )
    }
}

RepoLink.propTypes = {
    classes: PropTypes.object.isRequired,
    repo: PropTypes.object.isRequired,
};

export default withStyles(styles)(RepoLink);
