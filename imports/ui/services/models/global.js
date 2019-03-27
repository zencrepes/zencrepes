//https://github.com/pimterry/loglevel
import * as log from 'loglevel';
import { Meteor } from 'meteor/meteor';

import { cfgLabels } from "../../data/Minimongo.js";
import { cfgQueries } from "../../data/Minimongo.js";
import { cfgSources } from "../../data/Minimongo.js";
import { cfgIssues } from "../../data/Minimongo.js";
import { cfgMilestones } from "../../data/Minimongo.js";
import { cfgProjects } from "../../data/Minimongo.js";

export default {
    state: {
        log: {},
        menus: {},
        dataRefresh: false,
    },
    reducers: {
        setLog(state, payload) {return { ...state, log: payload };},
        setMenus(state, payload) {return { ...state, menus: payload };},
        setDataRefresh(state, payload) {return { ...state, dataRefresh: payload };},
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
        async checkData() {
            const incorrectIssues = cfgIssues.find({'data_version':{'$ne':Meteor.settings.public.data_version}}).count();
            if (incorrectIssues > 0) {
                this.setDataRefresh(true);
            }
        },
        async clearData() {
            cfgLabels.remove({});
            cfgQueries.remove({});
            cfgSources.remove({});
            cfgIssues.remove({});
            cfgMilestones.remove({});
            cfgProjects.remove({});
            this.setDataRefresh(false);
        },
    }
};
