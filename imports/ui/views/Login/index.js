import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';

import GitHubLogin from '../../components/Github/GitHubLogin.js';

import General from '../../layouts/General/index.js';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    /*
    appBar: {
        position: 'relative',
    },
    */
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
    }
});

class Login extends Component {
    constructor(props) {
        super(props);

        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimation: "cardHidden"
        };
    }

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function() {
                this.setState({ cardAnimation: "" });
            }.bind(this),
            700
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <General>
                <main className={classes.layout}>
                    <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={40}
                    >
                        <Grid item xs={12} sm={6} md={8}>
                            <h1 className={classes.title}>Log in to ZenCrepes</h1>
                            <div>
                                <hr className={classes.underline} />
                            </div>
                            <p className={classes.subtitle}>Agile analytics and management over GitHub organizations & repositories made easy!</p>
                            <p className={classes.paragraph}>Data is yours! ZenCrepes is <b><u>entirely client-side</u></b>, we don't see any of your data, none!</p>
                            <p className={classes.paragraph}>ZenCrepes operates across repositories and organizations and facilitates batch modifications. Welcome consistency!</p>
                            <p className={classes.paragraph}>If you update content, ZenCrepes will first stage the update and <b><u>you'll get to confirm
                                any changes</u></b> before pushing to GitHub.</p>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <h4 className={classes.secondTitle}>Get Started</h4>
                            <GitHubLogin />
                            <p className={classes.paragraphSmall}>This program is distributed in the hope that it will be useful,
                                but WITHOUT ANY WARRANTY; without even the implied warranty of
                                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                                GNU Affero General Public License for more details.</p>
                            <p className={classes.paragraphSmall}>By logging in, you are accepting the above-mentioned license.</p>
                        </Grid>
                    </Grid>
                </main>
            </General>
        );
    }

}
export default withStyles(styles)(Login);
