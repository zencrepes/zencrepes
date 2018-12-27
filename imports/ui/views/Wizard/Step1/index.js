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
                    When you'll move to the next stage, ZenCrepes will fetch all organizations you're a member of and fetch all of the corresponding repositories.
                    You will then be able to select an entire organization or individual repositories to be included in ZenCrepes.
                    As you select elements, ZenCrepes will indicate how many issues are included in those repos, giving you a sense of what will be loaded.
                </p>
                <p className={classes.subtitle}>Add external orgs and repos</p>
                <p className={classes.paragraph}>
                    You can also add public opensource repositories and organizations to ZenCrepes to load the associated data.
                    For example if you add "Jetbrains" as an organization, you'd be able ot select add some of the repositories to ZenCrepes (of course this will be read-only).<br />
                    If an org is configured not to allow listing of repositories, you can also add individual repositories. For example try adding the "elastic" organization and the "beats" repository.
                </p>
                <p className={classes.subtitle}>Watch-out for API Rate Limit</p>
                <p className={classes.paragraph}>GitHub has <a href="https://developer.github.com/v4/guides/resource-limitations/">API resources limits</a>, based on the complexity of the query and assigns 5000 points per 1 hour window.
                    You'll see current points status at the bottom of the screen.
                </p>
            </React.Fragment>
        );
    }
}

Step1.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);