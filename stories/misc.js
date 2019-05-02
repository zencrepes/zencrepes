import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { init } from "@rematch/core";

import PrIcon from '../imports/ui/components/Issue/PrIcon.js';

// The *.mock.js files contains static redux stores configuration with no external dependencies (such as minimongo).
import * as models from "../imports/ui/services/models/index.mock.js";
//https://medium.com/ingenious/storybook-meets-redux-6ab09a5be346

const store = init({
    models
});

storiesOf('Misc', module)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('PR Icon', () => (
        <PrIcon pr={
            {state: 'CLOSED',
            number: 1234,
            title: 'A title',
            url: 'http://test.com'}
        }/>
    ))
;