import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = {
    root: {
        textDecoration: 'none'
    },
};
class ProjectLink extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, project } = this.props;

        return (
            <a
                href={project.url}
                rel="noopener noreferrer" target="_blank"
                className={classes.root}
            >
                {project.name}
                <OpenInNewIcon style={{fontSize: 12}}/>
            </a>
        )
    }
}

ProjectLink.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectLink);
