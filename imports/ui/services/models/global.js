//https://github.com/pimterry/loglevel
import * as log from 'loglevel';
import { Meteor } from 'meteor/meteor';

export default {
    state: {
        log: {},
        menus: {},

        loading: false,             // Flag indicating something is loading
        loadingMsg: '',             // Message to be displayed in the modal or the snackbar
        loadingMsgAlt: '',          // Alternative message (2nd line) to be displayed in the modal or the snackbar
        loadingModal: true,         // True to display a modal, false to display a snackbar
        loadingIterateCurrent: 0,   // For progressbar, current count
        loadingIterateTotal: 0,     // For progressbar, maximum count
        loadingSuccess: false,      // Flag indicating if loading was successful
        loadingSuccessMsg:'',       // Message to be displayed at the end of loading (successful or not)
    },
    reducers: {
        setLog(state, payload) {return { ...state, log: payload };},
        setMenus(state, payload) {return { ...state, menus: payload };},

        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadingMsg(state, payload) {return { ...state, loadingMsg: payload };},
        setLoadingMsgAlt(state, payload) {return { ...state, loadingMsgAlt: payload };},
        setLoadingModal(state, payload) {return { ...state, loadingModal: payload };},
        setLoadingIterateCurrent(state, payload) {return { ...state, loadingIterateCurrent: payload };},
        incLoadingIterateCurrent(state, payload) {return { ...state, loadingIterateCurrent: state.loadingIterateCurrent + payload };},
        setLoadingIterateTotal(state, payload) {return { ...state, loadingIterateTotal: payload };},
        setLoadingSuccess(state, payload) {return { ...state, loadingSuccess: payload };},
        setLoadingSuccessMsg(state, payload) {return { ...state, loadingSuccessMsg: payload };},
    },
    effects: {
        async initApp() {
            const logger = log.noConflict();
            if (process.env.NODE_ENV !== 'production') {
                logger.enableAll();
            } else {
                logger.disableAll();
            }
            logger.info("Logger initialized");
            this.setLog(logger);

            if (Meteor.settings.public.menus !== undefined) {
                this.setMenus(Meteor.settings.public.menus);
            }

        },
        async cancelLoading() {
            this.setLoading(false);
            this.setLoadingMsg('');
        },
    }
};
