export default {
    state: {
        steps: ['Welcome !', 'Import Repositories', 'Agile'],
        activeStep: 0,

    },
    reducers: {
        setActiveStep(state, payload) {return { ...state, activeStep: payload };},

    },
    effects: {

    }
};