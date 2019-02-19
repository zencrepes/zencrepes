import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import General from "../../layouts/General/index.js";
import PropTypes from "prop-types";

import EmptyActions from '../../components/EmptyActions/index.js';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    appBar: {
        position: 'relative',
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
            width: 1000,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    title: {
        fontSize: '52px',
        lineHeight: 1.3,
    },
    underline: {
        margin: '18px 0',
        width: '100px',
        borderWidth: '2px',
        borderColor: '#27A0B6',
        borderTopStyle: 'solid',
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
    paragraphSmall: {
        color: '#898989',
        lineHeight: 1,
        fontSize: '14px',
        margin: '10px 0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
    secondTitle: {
        fontSize: '20px',
        lineHeight: 1.1,
        fontWeight: 600,
        letterSpacing: '.75px',
    },
    preText: {
        whiteSpace: 'pre-wrap',
    }
});

class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <General>
                <EmptyActions />
                <main className={classes.layout}>
                    <h1 className={classes.title}>About</h1>
                    <div>
                        <hr className={classes.underline} />
                    </div>
                    <p className={classes.subtitle}>Why ZenCrepes?</p>
                    <p className={classes.paragraph}>GitHub is a great platform, but managing projects across multiple organizations and repositories can be tedious.
                    From velocity metrics, to issues searching, it lacks project management features when taken outside of the context of a single repository.
                    </p>
                    <p className={classes.paragraph}>There are third-party tools to provide a project management layer across organizations and repositories, but those also have their own drawbacks
                        and a chunk of their features are directly dependent on their platform.
                    </p>
                    <p className={classes.paragraph}>
                        ZenCrepes was built to try to address some of these challenges, while helping to bring consistenty in cross-org, cross-repo projects.
                        ZenCrepes is only built on top of the GitHub API model, all of the data in ZenCrepes is directly hosted on GitHub. <br />
                        Your team can operate with GitHub issues as normal, while a centralized view is available in ZenCrepes.
                    </p>
                    <p className={classes.subtitle}>Client-side only</p>
                    <p className={classes.paragraph}>ZenCrepes is built as a client-side application.
                    We don&apos;t have a duplicate index of GitHub data in our own servers, all happen directly between you and GitHub.</p>
                    <p className={classes.paragraph}>
                        It means that initial load time will be slower (while all issues are loaded in memory),
                        ZenCrepes cannot be automatically notified about changes happening in GitHub (as you would see otherwise through GitHub hooks),
                        or browser performance (limited to 1 CPU thread) might result in lags for projects with a very large number of issues.
                    </p>
                    <p className={classes.paragraph}>Whenever possible, ZenCrepes only loads newly updated data (for GitHub issues and milestones for example).
                        At other times, everything has to be loaded (such as when refreshing Labels).</p>
                </main>
            </General>
        );
    }
}

About.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
