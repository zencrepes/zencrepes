import { Meteor } from 'meteor/meteor';

export default {
    state: {
        users: [],
        connectedUser: null,
    },
    reducers: {
        setUsers(state, payload) {return { ...state, users: payload };},
        setConnectedUser(state, payload) {return { ...state, connectedUser: JSON.parse(JSON.stringify(payload)) };},
    },
    effects: {
        async refreshUsers(payload) {
            this.setUsers(payload);
            const connectedUser = payload.filter(user => user.login === Meteor.user().services.github.username)[0];
            this.setConnectedUser(connectedUser);
        },
    }
};
