import { configure } from '@storybook/react';

function loadStories() {
//    require('../stories/layout.js');
    require('../stories/issues.js');
    // You can require as many stories as you need.
}

configure(loadStories, module);