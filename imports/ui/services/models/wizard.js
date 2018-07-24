export default {
    state: {
        steps: ['GitHub Repositories', 'Import more', 'Agile'],
        activeStep: 0,

    },
    reducers: {
        setActiveStep(state, payload) {return { ...state, activeStep: payload };},

    },
    effects: {

    }
};