import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

import General from '../imports/ui/layouts/General/index.js';

storiesOf('Layouts', module)
    .add('General', () => (
        <General><h4>General Content</h4></General>
    ))
    .add('Wizard', () => (
        <h1>Wizard - To Be Implemented</h1>
    ))
    .add('Login', () => (
        <h1>Login - To Be Implemented</h1>
    ));