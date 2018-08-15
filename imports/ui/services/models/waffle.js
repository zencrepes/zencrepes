import { cfgIssues } from '../../data/Minimongo.js';
import { cfgSources } from '../../data/Minimongo.js';
import axios from 'axios';

export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded

        message: '',               // Message to be displayed during load
        boardUrl: '',              // Waffle.io Board url to load data from

        loadedIssues: 0
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setBoardUrl(state, payload) {return { ...state, boardUrl: payload };},
        setMessage(state, payload) {return { ...state, message: payload };},

        setLoadedIssues(state, payload) {return { ...state, loadedIssues: payload };},
        setIncrementLoadedIssues(state, payload) {return { ...state, loadedIssues: state.loadedIssues + payload };},
    },
    effects: {

    }
};