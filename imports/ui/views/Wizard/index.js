import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import General from "../../layouts/General/index.js";

import WizardStepper from './WizardStepper.js';
import Step1 from './Step1/index.js';
import Step2 from './Step2/index.js';
import Step3 from './Step3/index.js';
import Step4 from './Step4/index.js';
import PropTypes from "prop-types";

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
    },

    wizardCard: {
        padding: theme.spacing.unit * 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '30px',
        marginBottom: '30px',
        //margin: 'auto',
        maxWidth: 1000,
    },
    wizardCardActions: {
        display: 'inline',
    },
    actionButtons: {
        textAlign: 'right',
    },
});

class Wizard extends Component {
    constructor(props) {
        super(props);
    }

    handleNext = () => {
        const { activeStep, changeActiveStep, steps, history } = this.props;
        if (activeStep === steps.length -1) { // User clicked on finish
            changeActiveStep(0);
            history.push('/issues');
        } else {
            changeActiveStep(activeStep + 1);
        }
    };

    handleBack = () => {
        const { activeStep, changeActiveStep } = this.props;
        changeActiveStep(activeStep - 1);
    };

    handleReset = () => {
        const { changeActiveStep } = this.props;
        changeActiveStep(0);
    };

    render() {
        const { classes, activeStep, steps, issues } = this.props;
        return (
            <General>
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
                                disabled={activeStep === steps.length - 1 && issues === 0 ? true : false} // Disable the finish button if no issues
                            >
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </CardActions>
                </Card>
            </General>
        );
    }
}

Wizard.propTypes = {
    classes: PropTypes.object.isRequired,
    activeStep: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    changeActiveStep: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    issues: PropTypes.number,
};

const mapState = state => ({
    activeStep: state.wizardView.activeStep,
    issues: state.wizardView.issues,
    steps: state.wizardView.steps,
});

const mapDispatch = dispatch => ({
    changeActiveStep: dispatch.wizardView.changeActiveStep,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(styles)(Wizard)));
