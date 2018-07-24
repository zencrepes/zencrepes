import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import WizardStepper from './WizardStepper.js';

import Step1 from './Step1/index.js';
import Step2 from './Step2/index.js';
import Step3 from './Step3/index.js';
import PropTypes from "prop-types";

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

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Organizations and Repositories';
        case 1:
            return 'What is an ad group anyways?';
        case 2:
            return 'This is the bit I really care about!';
        default:
            return 'Unknown step';
    }
}

class Wizard extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    handleNext = () => {
        const { activeStep, setActiveStep } = this.props;
        setActiveStep(activeStep + 1);
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
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                            {{
                                0: <Step1 />,
                                1: <Step2 />,
                                2: <Step3 />,
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
            </div>
        );
    }
}

Wizard.propTypes = {
    classes: PropTypes.object,
};


const mapState = state => ({
    activeStep: state.wizard.activeStep,
    steps: state.wizard.steps,

});

const mapDispatch = dispatch => ({
    setActiveStep: dispatch.wizard.setActiveStep,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Wizard));