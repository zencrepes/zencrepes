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

import GitRequests from '../../components/Github/GitRequests.js';

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
class Wizard extends Component {
    constructor(props) {
        super(props);
    }

    handleNext = () => {
        const { activeStep, setActiveStep, steps, history } = this.props;
        if (activeStep === steps.length -1) { // User clicked on finish
            setActiveStep(0);
            history.push('/dashboard');
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
                                <Card>
                                    <WizardStepper />
                                    <div>
                                        {activeStep === steps.length ? (
                                            <div>
                                                <Typography className={classes.instructions}>
                                                    All steps completed - you&quot;re finished
                                                </Typography>
                                                <Button onClick={this.handleReset} className={classes.button}>
                                                    Reset
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                {{
                                                    0: <Step1 />,
                                                    1: <Step2 />,
                                                    2: <Step3 />,
                                                    3: <Step4 />,
                                                }[activeStep]}
                                                <div>
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
                                            </div>
                                        )}
                                    </div>
                                    <GitRequests />
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

export default connect(mapState, mapDispatch)(withRouter(withStyles(wizardViewStyle)(Wizard)));
//export default connect(mapState, mapDispatch)(withRouter(withStyles(styles)(Wizard)));

/*
            <div>
                <h1>Wizard (General)</h1>
                <WizardStepper />
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&quot;re finished
                            </Typography>
                            <Button onClick={this.handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </div>
                    ) : (
                        <div>
                            {{
                                0: <Step1 />,
                                1: <Step2 />,
                                2: <Step3 />,
                                3: <Step4 />,
                            }[activeStep]}
                            <div>
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
                        </div>
                    )}
                </div>
                <GitRequests />
            </div>

 */