import { configure } from '@storybook/react';

function loadStories() {
//    require('../stories/layout.js');
    require('../stories/issues.js');
    require('../stories/sprints.js');
    require('../stories/labels.js');
//    require('../stories/cards.js');
    require('../stories/milestones.js');
    require('../stories/contributions.js');
    require('../stories/charts.js');
    require('../stories/misc.js');
}

configure(loadStories, module);