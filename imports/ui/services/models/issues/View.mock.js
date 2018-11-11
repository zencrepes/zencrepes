const mockQuery = JSON.parse("{\"repo.name\":{\"$in\":[\"ego\",\"enrolment\",\"score\"]},\"author.login\":{\"$in\":[\"lepsalex\"]},\"assignees.edges\":{\"$elemMatch\":{\"node.login\":{\"$in\":[\"lepsalex\",\"rtisma\"]}}}}");
const mockIssues = JSON.parse("[{\"_id\":\"yCryo8NBzzKnWRocZ\",\"id\":\"MDU6SXNzdWUzNzUxNjAxMDU=\",\"createdAt\":\"2018-10-29T18:37:24Z\",\"updatedAt\":\"2018-10-29T18:46:55Z\",\"closedAt\":null,\"databaseId\":375160105,\"number\":125,\"url\":\"https://github.com/overture-stack/score/issues/125\",\"title\":\"Preliminary look at converting service to OpenJDK 11\",\"state\":\"OPEN\",\"author\":{\"login\":\"Fgerthoffert\",\"avatarUrl\":\"https://avatars3.githubusercontent.com/u/5667028?v=4\",\"url\":\"https://github.com/Fgerthoffert\",\"__typename\":\"User\"},\"labels\":{\"totalCount\":2,\"edges\":[{\"node\":{\"id\":\"MDU6TGFiZWwxMDU0Njk4Mzgx\",\"color\":\"ededed\",\"name\":\"SP:3\",\"description\":null,\"__typename\":\"Label\"},\"__typename\":\"LabelEdge\"},{\"node\":{\"id\":\"MDU6TGFiZWw3OTQzMDMzNjc=\",\"color\":\"ededed\",\"name\":\"next\",\"description\":null,\"__typename\":\"Label\"},\"__typename\":\"LabelEdge\"}],\"__typename\":\"LabelConnection\"},\"milestone\":{\"id\":\"MDk6TWlsZXN0b25lMzc3ODM3MA==\",\"createdAt\":\"2018-10-29T18:30:46Z\",\"updatedAt\":\"2018-10-29T18:37:25Z\",\"closedAt\":null,\"description\":null,\"dueOn\":\"2018-11-12T00:00:00Z\",\"issues\":{\"totalCount\":2,\"__typename\":\"IssueConnection\"},\"number\":23,\"state\":\"OPEN\",\"title\":\"ARGO - Sprint 198\",\"url\":\"https://github.com/overture-stack/score/milestone/23\",\"__typename\":\"Milestone\"},\"assignees\":{\"totalCount\":1,\"edges\":[{\"node\":{\"id\":\"MDQ6VXNlcjk0Mjk1MQ==\",\"avatarUrl\":\"https://avatars0.githubusercontent.com/u/942951?v=4\",\"login\":\"rtisma\",\"name\":null,\"url\":\"https://github.com/rtisma\",\"__typename\":\"User\"},\"__typename\":\"UserEdge\"}],\"__typename\":\"UserConnection\"},\"comments\":{\"totalCount\":0,\"__typename\":\"IssueCommentConnection\"},\"participants\":{\"totalCount\":2,\"__typename\":\"UserConnection\"},\"__typename\":\"Issue\",\"repo\":{\"_id\":\"KHSibNuRvYkLzR2e5\",\"id\":\"MDEwOlJlcG9zaXRvcnkzMjk1NDY3OA==\",\"name\":\"score\",\"url\":\"https://github.com/overture-stack/score\",\"databaseId\":32954678,\"diskUsage\":43319,\"forkCount\":6,\"isPrivate\":false,\"isArchived\":false,\"issues\":{\"totalCount\":30,\"edges\":[{\"node\":{\"id\":\"MDU6SXNzdWUzNzUxNjAxMDU=\",\"updatedAt\":\"2018-10-29T18:46:55Z\",\"__typename\":\"Issue\"},\"__typename\":\"IssueEdge\"}],\"__typename\":\"IssueConnection\"},\"labels\":{\"totalCount\":18,\"__typename\":\"LabelConnection\"},\"milestones\":{\"totalCount\":13,\"__typename\":\"MilestoneConnection\"},\"pullRequests\":{\"totalCount\":95,\"__typename\":\"PullRequestConnection\"},\"releases\":{\"totalCount\":0,\"__typename\":\"ReleaseConnection\"},\"__typename\":\"Repository\",\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"active\":true},\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"stats\":{\"openedDuring\":null,\"createdSince\":5,\"closedSince\":null,\"updatedSince\":5},\"refreshed\":true,\"pinned\":false,\"points\":3,\"active\":true},{\"_id\":\"APMSvcea5n4utrJn3\",\"id\":\"MDU6SXNzdWUzNzM1MDk5OTQ=\",\"createdAt\":\"2018-10-24T14:23:21Z\",\"updatedAt\":\"2018-10-29T18:31:48Z\",\"closedAt\":null,\"databaseId\":373509994,\"number\":122,\"url\":\"https://github.com/overture-stack/score/issues/122\",\"title\":\"Debug collab large upload from client\",\"state\":\"OPEN\",\"author\":{\"login\":\"rtisma\",\"avatarUrl\":\"https://avatars0.githubusercontent.com/u/942951?v=4\",\"url\":\"https://github.com/rtisma\",\"__typename\":\"User\"},\"labels\":{\"totalCount\":3,\"edges\":[{\"node\":{\"id\":\"MDU6TGFiZWwxMDU0Njk4Mzc0\",\"color\":\"ededed\",\"name\":\"SP:2\",\"description\":null,\"__typename\":\"Label\"},\"__typename\":\"LabelEdge\"},{\"node\":{\"id\":\"MDU6TGFiZWwxOTI1MDQxNjY=\",\"color\":\"ee0701\",\"name\":\"bug\",\"description\":null,\"__typename\":\"Label\"},\"__typename\":\"LabelEdge\"},{\"node\":{\"id\":\"MDU6TGFiZWw3OTQzMDMzNjc=\",\"color\":\"ededed\",\"name\":\"next\",\"description\":null,\"__typename\":\"Label\"},\"__typename\":\"LabelEdge\"}],\"__typename\":\"LabelConnection\"},\"milestone\":{\"id\":\"MDk6TWlsZXN0b25lMzc3ODM3MA==\",\"createdAt\":\"2018-10-29T18:30:46Z\",\"updatedAt\":\"2018-10-29T18:37:25Z\",\"closedAt\":null,\"description\":null,\"dueOn\":\"2018-11-12T00:00:00Z\",\"issues\":{\"totalCount\":2,\"__typename\":\"IssueConnection\"},\"number\":23,\"state\":\"OPEN\",\"title\":\"ARGO - Sprint 198\",\"url\":\"https://github.com/overture-stack/score/milestone/23\",\"__typename\":\"Milestone\"},\"assignees\":{\"totalCount\":1,\"edges\":[{\"node\":{\"id\":\"MDQ6VXNlcjk0Mjk1MQ==\",\"avatarUrl\":\"https://avatars0.githubusercontent.com/u/942951?v=4\",\"login\":\"rtisma\",\"name\":null,\"url\":\"https://github.com/rtisma\",\"__typename\":\"User\"},\"__typename\":\"UserEdge\"}],\"__typename\":\"UserConnection\"},\"comments\":{\"totalCount\":0,\"__typename\":\"IssueCommentConnection\"},\"participants\":{\"totalCount\":2,\"__typename\":\"UserConnection\"},\"__typename\":\"Issue\",\"repo\":{\"_id\":\"KHSibNuRvYkLzR2e5\",\"id\":\"MDEwOlJlcG9zaXRvcnkzMjk1NDY3OA==\",\"name\":\"score\",\"url\":\"https://github.com/overture-stack/score\",\"databaseId\":32954678,\"diskUsage\":43319,\"forkCount\":6,\"isPrivate\":false,\"isArchived\":false,\"issues\":{\"totalCount\":30,\"edges\":[{\"node\":{\"id\":\"MDU6SXNzdWUzNzUxNjAxMDU=\",\"updatedAt\":\"2018-10-29T18:46:55Z\",\"__typename\":\"Issue\"},\"__typename\":\"IssueEdge\"}],\"__typename\":\"IssueConnection\"},\"labels\":{\"totalCount\":18,\"__typename\":\"LabelConnection\"},\"milestones\":{\"totalCount\":13,\"__typename\":\"MilestoneConnection\"},\"pullRequests\":{\"totalCount\":95,\"__typename\":\"PullRequestConnection\"},\"releases\":{\"totalCount\":0,\"__typename\":\"ReleaseConnection\"},\"__typename\":\"Repository\",\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"active\":true},\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"stats\":{\"openedDuring\":null,\"createdSince\":10,\"closedSince\":null,\"updatedSince\":5},\"refreshed\":true,\"pinned\":false,\"points\":2,\"active\":true},{\"_id\":\"vHTzB6g7bEjJZwWZJ\",\"id\":\"MDU6SXNzdWUzNzQwNDQ5ODE=\",\"createdAt\":\"2018-10-25T17:07:04Z\",\"updatedAt\":\"2018-10-26T16:35:14Z\",\"closedAt\":\"2018-10-26T16:35:09Z\",\"databaseId\":374044981,\"number\":123,\"url\":\"https://github.com/overture-stack/score/issues/123\",\"title\":\"compatibility of score 1.4.0 or icgc-storage-client 1.0.23 on Ubuntu 18.04\",\"state\":\"CLOSED\",\"author\":{\"login\":\"jmimico\",\"avatarUrl\":\"https://avatars0.githubusercontent.com/u/19290745?v=4\",\"url\":\"https://github.com/jmimico\",\"__typename\":\"User\"},\"labels\":{\"totalCount\":1,\"edges\":[{\"node\":{\"id\":\"MDU6TGFiZWwxOTI1MDQxNjY=\",\"color\":\"ee0701\",\"name\":\"bug\",\"description\":null,\"__typename\":\"Label\"},\"__typename\":\"LabelEdge\"}],\"__typename\":\"LabelConnection\"},\"milestone\":null,\"assignees\":{\"totalCount\":1,\"edges\":[{\"node\":{\"id\":\"MDQ6VXNlcjk0Mjk1MQ==\",\"avatarUrl\":\"https://avatars0.githubusercontent.com/u/942951?v=4\",\"login\":\"rtisma\",\"name\":null,\"url\":\"https://github.com/rtisma\",\"__typename\":\"User\"},\"__typename\":\"UserEdge\"}],\"__typename\":\"UserConnection\"},\"comments\":{\"totalCount\":2,\"__typename\":\"IssueCommentConnection\"},\"participants\":{\"totalCount\":3,\"__typename\":\"UserConnection\"},\"__typename\":\"Issue\",\"repo\":{\"_id\":\"KHSibNuRvYkLzR2e5\",\"id\":\"MDEwOlJlcG9zaXRvcnkzMjk1NDY3OA==\",\"name\":\"score\",\"url\":\"https://github.com/overture-stack/score\",\"databaseId\":32954678,\"diskUsage\":43319,\"forkCount\":6,\"isPrivate\":false,\"isArchived\":false,\"issues\":{\"totalCount\":30,\"edges\":[{\"node\":{\"id\":\"MDU6SXNzdWUzNzUxNjAxMDU=\",\"updatedAt\":\"2018-10-29T18:46:55Z\",\"__typename\":\"Issue\"},\"__typename\":\"IssueEdge\"}],\"__typename\":\"IssueConnection\"},\"labels\":{\"totalCount\":18,\"__typename\":\"LabelConnection\"},\"milestones\":{\"totalCount\":13,\"__typename\":\"MilestoneConnection\"},\"pullRequests\":{\"totalCount\":95,\"__typename\":\"PullRequestConnection\"},\"releases\":{\"totalCount\":0,\"__typename\":\"ReleaseConnection\"},\"__typename\":\"Repository\",\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"active\":true},\"org\":{\"name\":\"Overture\",\"login\":\"overture-stack\",\"id\":\"MDEyOk9yZ2FuaXphdGlvbjMyNDk4MjUw\",\"url\":\"https://github.com/overture-stack\",\"repositories\":{\"totalCount\":20,\"__typename\":\"RepositoryConnection\"},\"__typename\":\"Organization\"},\"stats\":{\"openedDuring\":1,\"createdSince\":9,\"closedSince\":8,\"updatedSince\":8},\"refreshed\":true,\"pinned\":false,\"points\":null,\"active\":true}]");

export default {
    state: {
        issues: mockIssues,
        facets: [],
        queries: [],

        selectedTab: 0, // Selected tab to be displayed

        query: mockQuery,

        defaultPoints: true,    // Default display to points, otherwise issues count

        burndown: {},
        shouldBurndownDataReload: false,  // We don't want to reload the burndown data automatically when issues are changed

        velocity: {},
        shouldVelocityDataReload: false,  // We don't want to reload the velocity data automatically when issues are changed

        remainingWorkRepos: [],                  // List repos with open issues
        remainingWorkPoints: 0,
        remainingWorkCount: 0,
        shouldSummaryDataReload: false,

    },
    reducers: {
        setIssues(state, payload) {return { ...state, issues: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
        setQueries(state, payload) {return { ...state, queries: payload };},
        setSelectedTab(state, payload) {return { ...state, selectedTab: payload };},

        setQuery(state, payload) {return { ...state, query: JSON.parse(JSON.stringify(payload)) };},

        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},

        setShouldBurndownDataReload(state, payload) {return { ...state, shouldBurndownDataReload: payload };},
        setBurndown(state, payload) {return { ...state, burndown: JSON.parse(JSON.stringify(payload)) };},

        setShouldVelocityDataReload(state, payload) {return { ...state, shouldVelocityDataReload: payload };},
        setVelocity(state, payload) {return { ...state, velocity: JSON.parse(JSON.stringify(payload)) };},

        setShouldSummaryDataReload(state, payload) {return { ...state, shouldSummaryDataReload: payload };},
        setRemainingWorkRepos(state, payload) {return { ...state, remainingWorkRepos: payload };},
        setRemainingWorkPoints(state, payload) {return { ...state, remainingWorkPoints: payload };},
        setRemainingWorkCount(state, payload) {return { ...state, remainingWorkCount: payload };},
    },
    effects: {
        async initIssues(payload, rootState) {
            console.log('initIssues');
        },

        async updateQuery(query, rootState) {
            console.log('initIssues');
        },

        async addRemoveQuery(valueName, rootState, facet) {
            console.log('addRemoveQuery');
        },

        async deleteQuery(query, rootState) {
            console.log('deleteQuery');
        },

        async refreshQueries(payload, rootState) {
            console.log('refreshQueries');
        },

        async saveQuery(queryName, rootState) {
            console.log('saveQuery');
        },

        async refreshIssues(payload, rootState) {
            console.log('refreshIssues');
        },

        async refreshSummary(payload, rootState) {
            console.log('refreshSummary');
        },

        async refreshFacets(payload, rootState) {
            console.log('refreshFacets');
        },

        async refreshBurndown(payload, rootState) {
            console.log('refreshBurndown');
        },

        async refreshVelocity(payload, rootState) {
            console.log('refreshVelocity');
        },
    }
};
