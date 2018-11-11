const mockSelectedSprintTitle = "ARGO - Sprint 197";
const mockMilestones = JSON.parse("[{\"_id\":\"7ADerQoGW6fXagYRg\",\"id\":\"MDk6TWlsZXN0b25lMzc2OTYwMw==\",\"createdAt\":\"2018-10-25T18:51:21Z\",\"updatedAt\":\"2018-10-25T18:51:21Z\",\"closedAt\":null,\"description\":null,\"dueOn\":\"2018-10-29T00:00:00Z\",\"issues\":{\"totalCount\":1,\"__typename\":\"IssueConnection\"},\"number\":22,\"state\":\"OPEN\",\"title\":\"ARGO - Sprint 197\",\"url\":\"https://github.com/overture-stack/score/milestone/22\",\"__typename\":\"Milestone\",\"repo\":{\"_id\":\"KHSibNuRvYkLzR2e5\",\"id\":\"MDEwOlJlcG9zaXRvcnkzMjk1NDY3OA==\",\"name\":\"score\",\"url\":\"https://github.com/overture-stack/score\",\"databaseId\":32954678,\"diskUsage\":43314,\"forkCount\":6,\"isPrivate\":false,\"isArchived\":false,\"issues\":{\"totalCount\":27,\"edges\":[{\"node\":{\"id\":\"MDU6SXNzdWUzNjA0MDYzNzg=\",\"updatedAt\":\"2018-10-02T16:01:26Z\",\"__typename\":\"Issue\"},\"__typename\":\"IssueEdge\"}],\"__typename\":\"IssueConnection\"},\"labels\":{\"totalCount\":18,\"__typename\":\"LabelConnection\"},\"milestones\":{\"totalCount\":12,\"__typename\":\"MilestoneConnection\"},\"pullRequests\":{\"totalCount\":94,\"__typename\":\"PullRequestConnection\"},\"releases\":{\"totalCount\":0,\"__typename\":\"ReleaseConnection\"},\"__typename\":\"Repository\",\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"active\":true},\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"}},{\"_id\":\"g4RPZje9HkQGqaY3Q\",\"id\":\"MDk6TWlsZXN0b25lMzc0MDgxMQ==\",\"createdAt\":\"2018-10-15T18:49:15Z\",\"updatedAt\":\"2018-11-01T21:02:07Z\",\"closedAt\":\"2018-11-01T21:02:07Z\",\"description\":null,\"dueOn\":\"2018-10-29T00:00:00Z\",\"issues\":{\"totalCount\":4,\"__typename\":\"IssueConnection\"},\"number\":17,\"state\":\"CLOSED\",\"title\":\"ARGO - Sprint 197\",\"url\":\"https://github.com/overture-stack/SONG/milestone/17\",\"__typename\":\"Milestone\",\"repo\":{\"_id\":\"zZNTCqX8rcJcawp98\",\"id\":\"MDEwOlJlcG9zaXRvcnk4ODU2NDU5Mg==\",\"name\":\"SONG\",\"url\":\"https://github.com/overture-stack/SONG\",\"databaseId\":88564592,\"diskUsage\":4082,\"forkCount\":2,\"isPrivate\":false,\"isArchived\":false,\"issues\":{\"totalCount\":173,\"edges\":[{\"node\":{\"id\":\"MDU6SXNzdWUzNzUxNjYyNTM=\",\"updatedAt\":\"2018-10-29T18:56:01Z\",\"__typename\":\"Issue\"},\"__typename\":\"IssueEdge\"}],\"__typename\":\"IssueConnection\"},\"labels\":{\"totalCount\":35,\"__typename\":\"LabelConnection\"},\"milestones\":{\"totalCount\":14,\"__typename\":\"MilestoneConnection\"},\"pullRequests\":{\"totalCount\":181,\"__typename\":\"PullRequestConnection\"},\"releases\":{\"totalCount\":11,\"__typename\":\"ReleaseConnection\"},\"__typename\":\"Repository\",\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"active\":true},\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"}}]");

export default {
    state: {
        sprints: [],
        selectedSprintTitle: mockSelectedSprintTitle,

        assignees: [],
        availableAssignees: [],
        filteredAvailableAssignees: [],
        availableAssigneesFilter: '',
        openAddAssignee: false,

        repositories: [],
        availableRepositories: [],
        filteredAvailableRepositories: [],
        availableRepositoryFilter: '',
        openAddRepository: false,

        labels: [],

        issues: [],

        milestones: mockMilestones,

        velocity: [],

        openCreateSprint: false,
        createSprintName: '',
        createSprintEndDate: '',
        searchIssue: '',
        selectedIssue: null,
    },
    reducers: {
        setSprints(state, payload) {return { ...state, sprints: payload };},
        setSelectedSprintTitle(state, payload) {return { ...state, selectedSprintTitle: payload };},

        setAssignees(state, payload) {return { ...state, assignees: JSON.parse(JSON.stringify(payload)) };},
        setOpenAddAssignee(state, payload) {return { ...state, openAddAssignee: payload };},
        setAvailableAssignees(state, payload) {return { ...state, availableAssignees: JSON.parse(JSON.stringify(payload))};},
        setFilteredAvailableAssignees(state, payload) {return { ...state, filteredAvailableAssignees: JSON.parse(JSON.stringify(payload)) };},
        setAvailableAssigneesFilter(state, payload) {return { ...state, availableAssigneesFilter: payload };},

        setRepositories(state, payload) {return { ...state, repositories: JSON.parse(JSON.stringify(payload)) };},
        setOpenAddRepository(state, payload) {return { ...state, openAddRepository: payload };},
        setAvailableRepositories(state, payload) {return { ...state, availableRepositories: JSON.parse(JSON.stringify(payload))};},
        setFilteredAvailableRepositories(state, payload) {return { ...state, filteredAvailableRepositories: JSON.parse(JSON.stringify(payload)) };},
        setAvailableRepositoriesFilter(state, payload) {return { ...state, availableRepositoriesFilter: payload };},

        setIssues(state, payload) {return { ...state, issues: JSON.parse(JSON.stringify(payload)) };},
        setMilestones(state, payload) {return { ...state, milestones: JSON.parse(JSON.stringify(payload)) };},

        setVelocity(state, payload) {return { ...state, velocity: payload };},

        setLabels(state, payload) {return { ...state, labels: payload };},

        setOpenCreateSprint(state, payload) {return { ...state, openCreateSprint: payload };},
        setCreateSprintName(state, payload) {return { ...state, createSprintName: payload };},
        setCreateSprintEndDate(state, payload) {return { ...state, createSprintEndDate: payload };},
        setSearchIssue(state, payload) {return { ...state, searchIssue: payload };},
        setSelectedIssue(state, payload) {return { ...state, selectedIssue: payload };},

    },
    effects: {
        async updateAvailableSprints(payload, rootState) {
            console.log('updateAvailableSprints');
        },
        async updateSelectedSprint(selectedSprintTitle, rootState) {
            console.log('updateSelectedSprint');
        },

        async updateView(payload, rootState) {
            console.log('updateView');
        },

        async updateVelocity(assignees, rootState) {
            console.log('updateVelocity');
        },

        async updateAvailableAssigneesFilter(payload, rootState) {
            console.log('updateAvailableAssigneesFilter');
        },

        async addAssignee(payload, rootState) {
            console.log('addAssignee');
        },

        async updateAvailableRepositoriesFilter(payload, rootState) {
            console.log('updateAvailableRepositoriesFilter');
        },

        async addRepository(payload, rootState) {
            console.log('addRepository');
        },

        async sprintCreated(payload, rootState) {
            console.log('sprintCreated');
        }
    }
};
