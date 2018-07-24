export default {
    state: {
        steps: ['GitHub Repositories', 'Stats', 'Agile'],
        activeStep: 0,

    },
    reducers: {
        setActiveStep(state, payload) {return { ...state, activeStep: payload };},

    },
    effects: {

    }
};