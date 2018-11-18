import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { Provider } from 'react-redux';
import { init } from "@rematch/core";

import General from '../imports/ui/layouts/General/index.js';

// The *.mock.js files contains static redux stores configuration with no external dependencies (such as minimongo).
import * as models from "../imports/ui/services/models/index.mock.js";
//https://medium.com/ingenious/storybook-meets-redux-6ab09a5be346

const store = init({
    models
});

storiesOf('Layouts', module)
    .addDecorator(story => <Router>{story()}</Router>)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('General', () => (
            <General><h4>General Content</h4></General>
    ))
    .add('Wizard', () => (
        <h1>Wizard - To Be Implemented</h1>
    ))
    .add('Login', () => (
        <h1>Login - To Be Implemented</h1>
    ));