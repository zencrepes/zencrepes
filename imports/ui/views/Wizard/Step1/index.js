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
                    ZenCrepes will first fetch all organizations and repositories you&apos;re a member of and let you select repositories to be included..
                </p>
                <p className={classes.subtitle}>Add external orgs and repos</p>
                <p className={classes.paragraph}>
                    ZenCrepes will also allow you to add public opensource repositories and organizations and load their public data.
                    For example if you add &quot;Jetbrains&quot; as an organization, you&apos;d be able ot select add some of the repositories to ZenCrepes (of course this will be read-only).<br />
                    If an org is configured not to allow listing of repositories, you can also add individual repositories. For example try adding the &quot;elastic&quot; organization and the &quot;beats&quot; repository.
                </p>
                <p className={classes.subtitle}>Watch-out for API Rate Limit</p>
                <p className={classes.paragraph}>GitHub has <a href="https://developer.github.com/v4/guides/resource-limitations/">API resources limits</a>, based on the complexity of the query and assigns 5000 points per 1 hour window.
                    You&apos;ll see current points status at the bottom of the screen.
                </p>
            </React.Fragment>
        );
    }
}

Step1.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);