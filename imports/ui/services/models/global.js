//https://github.com/pimterry/loglevel
import * as log from 'loglevel';

export default {
    state: {
        log: {},
        menus: {},
    },
    reducers: {
        setLog(state, payload) {return { ...state, log: payload };},
        setMenus(state, payload) {return { ...state, menus: payload };},
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
    }
};
