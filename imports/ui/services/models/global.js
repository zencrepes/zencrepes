//https://github.com/pimterry/loglevel
import * as log from 'loglevel';

export default {
    state: {
        log: () => {},
    },
    reducers: {
        setLog(state, payload) {return { ...state, log: payload };},
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
        },
    }
};
