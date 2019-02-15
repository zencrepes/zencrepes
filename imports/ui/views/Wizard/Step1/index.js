import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const styles = {
    root: {
    },
    subtitle: {
        fontSize: '20px',
        fontFamily: 'Roboto',
        fontWeight: 400,
        lineHeight: 1.5,
    },
    paragraph: {
        color: '#898989',
        lineHeight: 1.75,
        fontSize: '16px',
        margin: '0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
};

class Step1 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <p className={classes.subtitle}>Select your repositories</p>
                <p className={classes.paragraph}>
                    First, select organizations and repositories to load data from. ZenCrepes will then batch-load from GitHub to your local browser. In various parts of the
                    application you will have the ability to either refresh local data or push changes to GitHub.
                </p>
                <p className={classes.subtitle}>Add external orgs and repos</p>
                <p className={classes.paragraph}>
                    You can also load data from public organizations and repositories. You can track dependencies with external projects, or simply explore another team&apos;s content, All of this in read-only mode.
                     For example try adding the &quot;microsoft&quot; organization with the &quot;cntk&quot; repository.
                </p>
                <p className={classes.subtitle}>Watch-out for GitHub API resources limits</p>
                <p className={classes.paragraph}>GitHub has <a href="https://developer.github.com/v4/guides/resource-limitations/">API resources limits</a>, based on the complexity of the query.
                    You get 5000 points per 1 hour window, ZenCrepes display your current points consumption at the bottom of every screens.
                </p>
            </React.Fragment>
        );
    }
}

Step1.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);