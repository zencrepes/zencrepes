export default {
    state: {
        steps: ['Welcome !', 'Import Repositories', 'Load Data', 'Be Agile !'],
        activeStep: 0,
    },
    reducers: {
        setActiveStep(state, payload) {return { ...state, activeStep: payload };},

    },
    effects: {

    }
};