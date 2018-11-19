import { configure } from '@storybook/react';

function loadStories() {
    require('../stories/layout.js');
    require('../stories/issues.js');
    require('../stories/sprints.js');
    require('../stories/labels.js');
    require('../stories/cards.js');
}

configure(loadStories, module);