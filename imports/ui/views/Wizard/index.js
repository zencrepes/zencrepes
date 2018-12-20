import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import wizardViewStyle from "../../assets/jss/thatapp/views/wizard.jsx";
import Footer from "../../components/Footer/index.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Card from "../../components/Card/Card.js";

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import GitRequests from '../../components/Github/GitRequests.js';
import General from "../../layouts/General/index.js";

import WizardStepper from './WizardStepper.js';

import Step1 from './Step1/index.js';
import Step2 from './Step2/index.js';
import Step3 from './Step3/index.js';
import Step4 from './Step4/index.js';
import PropTypes from "prop-types";

/*
const styles = theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});
*/

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
        fontSize: '40px',
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

class Wizard extends Component {
    constructor(props) {
        super(props);
    }

    handleNext = () => {
        const { activeStep, setActiveStep, steps, history } = this.props;
        if (activeStep === steps.length -1) { // User clicked on finish
            setActiveStep(0);
            history.push('/issues');
        } else {
            setActiveStep(activeStep + 1);
        }

    };

    handleBack = () => {
        const { activeStep, setActiveStep } = this.props;
        setActiveStep(activeStep - 1);
    };

    handleReset = () => {
        const { setActiveStep } = this.props;
        setActiveStep(0);
    };

    render() {
        const { classes, activeStep, steps } = this.props;
        return (
            <General>
                <main className={classes.layout}>
                    <h1 className={classes.title}>Initial Setup</h1>
                    <div>
                        <hr className={classes.underline} />
                    </div>
                </main>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={12}>
                        <Card className={classes.wizardCard}>
                            <CardContent>
                                <div className={classes.wizardStepper}>
                                    <WizardStepper />
                                </div>
                                <div className={classes.wizardCardContent}>
                                    {{
                                        0: <Step1 />,
                                        1: <Step2 />,
                                        2: <Step3 />,
                                        3: <Step4 />,
                                    }[activeStep]}
                                </div>
                            </CardContent>
                            <CardActions className={classes.wizardCardActions}>
                                <div className={classes.actionButtons}>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={this.handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={this.handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                                <div>
                                    <GitRequests />
                                </div>
                            </CardActions>
                        </Card>
                    </GridItem>
                </GridContainer>
            </General>
        );
    }
}

Wizard.propTypes = {
    classes: PropTypes.object,
    activeStep: PropTypes.number,
    steps: PropTypes.array,
    setActiveStep: PropTypes.func,
    history: PropTypes.object,
};

const mapState = state => ({
    activeStep: state.wizard.activeStep,
    steps: state.wizard.steps,
});

const mapDispatch = dispatch => ({
    setActiveStep: dispatch.wizard.setActiveStep,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(styles)(Wizard)));
