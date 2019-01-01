const mockUsers = JSON.parse("[{\"avatarUrl\":\"https://avatars3.githubusercontent.com/u/5667028?v=4\",\"name\":\"Francois G.\",\"login\":\"Fgerthoffert\",\"url\":\"https://github.com/Fgerthoffert\",\"__typename\":\"User\"}]\n");
const mockConnectedUsers = JSON.parse("{\"avatarUrl\":\"https://avatars3.githubusercontent.com/u/5667028?v=4\",\"name\":\"Francois G.\",\"login\":\"Fgerthoffert\",\"url\":\"https://github.com/Fgerthoffert\",\"__typename\":\"User\"}");

export default {
    state: {
        users: mockUsers,
        connectedUser: mockConnectedUsers,
    },
    reducers: {
        setUsers(state, payload) {return { ...state, users: payload };},
        setConnectedUser(state, payload) {return { ...state, connectedUser: JSON.parse(JSON.stringify(payload)) };},
    },
    effects: {
        async refreshUsers() {
        },
    }
};
