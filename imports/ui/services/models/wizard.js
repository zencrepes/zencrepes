export default {
    state: {
        steps: ['Welcome !', 'Configure Repositories', 'Load Data', 'Be Agile !'],
        activeStep: 0,
    },
    reducers: {
        setActiveStep(state, payload) {return { ...state, activeStep: payload };},

    },
    effects: {

    }
};