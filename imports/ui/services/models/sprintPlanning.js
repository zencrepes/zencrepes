export default {
    state: {
        sprintName: 'No Sprint Selected',
    },
    reducers: {
        setSprintName(state, payload) {return { ...state, sprintName: payload };},
    },

    effects: {

    }
};

