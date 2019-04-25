import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { init } from "@rematch/core";

import ContributionsTable from '../imports/ui/views/Issues/Content/Contributions/Assignees/Table/index.js';

// The *.mock.js files contains static redux stores configuration with no external dependencies (such as minimongo).
import * as models from "../imports/ui/services/models/index.mock.js";
import {BrowserRouter as Router} from "react-router-dom";
//https://medium.com/ingenious/storybook-meets-redux-6ab09a5be346

const store = init({
    models
});

storiesOf('Contributions', module)
    .addDecorator(story => <Router>{story()}</Router>)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('Table', () => (
        <ContributionsTable contributions={[]} defaultPoints={true}/>
    ))
;