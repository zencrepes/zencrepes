import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { connect } from "react-redux";

const styles = theme => ({
    root: {
        width: '90%',
        margin: 'auto',
        textAlign: 'center',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});



class WizardStepper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, activeStep, steps } = this.props;
        console.log(activeStep);
        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const props = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...props}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

            </div>
        );
    }
}

WizardStepper.propTypes = {
    classes: PropTypes.object,
    activeStep: PropTypes.number,
    steps: PropTypes.array,
};

const mapState = state => ({
    activeStep: state.wizardView.activeStep,
    steps: state.wizardView.steps,
});

export default connect(mapState, null)(withStyles(styles)(WizardStepper));