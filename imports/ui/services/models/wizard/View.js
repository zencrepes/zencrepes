import { cfgSources } from '../../../data/Minimongo.js';

export default {
    state: {
        steps: ['Welcome !', 'Configure Repositories', 'Load Data', 'Be Agile !'],
        activeStep: 0,
        reposIssues: 0,
    },
    reducers: {
        setActiveStep(state, payload) {return { ...state, activeStep: payload };},
        setReposIssues(state, payload) {return { ...state, reposIssues: payload };},
    },
    effects: {
        changeActiveStep(payload) {
            this.setActiveStep(payload);
            this.updateReposIssues();
        },
        updateReposIssues() {
            const issuesCount = cfgSources.find({active: true}).map(repo => repo.issues.totalCount).reduce((acc, count) => acc + count, 0);
            this.setReposIssues(issuesCount);
        }
    }
};