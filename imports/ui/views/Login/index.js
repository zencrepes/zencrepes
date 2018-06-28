/*
Note: Most of this page design has been copied over from:
https://github.com/creativetimofficial/material-kit-react/blob/master/src/views/LoginPage/LoginPage.jsx
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

// core components
import Footer from "../../components/Footer/index.js";

import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardFooter from "../../components/Card/CardFooter.js";

import loginPageStyle from "../../assets/jss/material-kit-react/views/loginPage.jsx";

import GitHubLogin from './GitHubLogin.js';

//import background from "../../assets/img/newyork.jpg";

class Login extends Component {
    constructor(props) {
        super(props);

        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden"
        };
    }

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function() {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div
                    className={classes.pageHeader}
                    style={{
                        //backgroundImage: "url(" + background + ")",
                        backgroundImage: "url(/newyork.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "top center"
                    }}
                >
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={4}>
                                <Card className={classes[this.state.cardAnimaton]}>
                                    <form className={classes.form}>
                                        <CardHeader color="primary" className={classes.cardHeader}>
                                            <div className={classes.socialLine}>
                                                <GitHubLogin />
                                            </div>
                                        </CardHeader>
                                        <p className={classes.divider}>A project management tool over GitHub issues</p>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button color="primary" className={classes.button}>
                                                Learn more
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                    <Footer whiteFont />
                </div>
            </div>
        );
    }
}
export default withStyles(loginPageStyle)(Login);