import { cfgIssues } from '../../data/Minimongo.js';
import { cfgSources } from '../../data/Minimongo.js';
import axios from 'axios';

export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        message: '',            // Message to be displayed during load
        token: '',              // Zenhub Token

        rateLimitMax: 80,           // To handle Zenhub API rate limiting
        rateLimitUsed: 0,           // To handle Zenhub API rate limiting
        rateLimitPause: 60000,      // in ms - To handle Zenhub API rate limiting

        paused: false,              // Calls to Zenhub are currently on hold
        resumeIn: 60,               // Calls to Zenhub will resume in X seconds

        loadedIssues: 0
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setPaused(state, payload) {return { ...state, paused: payload };},
        setMessage(state, payload) {return { ...state, message: payload };},
        setResumeIn(state, payload) {return { ...state, resumeIn: payload };},

        setToken(state, payload) {return { ...state, token: payload };},
        setRateLimitUsed(state, payload) {return { ...state, rateLimitUsed: payload };},

        setLoadedIssues(state, payload) {return { ...state, loadedIssues: payload };},
        setIncrementLoadedIssues(state, payload) {return { ...state, loadedIssues: state.loadedIssues + payload };},
    },
    effects: {

    }
};