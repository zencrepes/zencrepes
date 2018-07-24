import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { connect } from "react-redux";

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



class WizardStepper extends React.Component {

    render() {
        const { classes, activeStep, steps } = this.props;

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
};

const mapState = state => ({
    activeStep: state.wizard.activeStep,
    steps: state.wizard.steps,

});

const mapDispatch = dispatch => ({
    setActiveStep: dispatch.wizard.setActiveStep,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(WizardStepper));