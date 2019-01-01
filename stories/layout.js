import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { init } from "@rematch/core";

import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

//import General from '../imports/ui/layouts/General/index.js';
import CustomCard from '../imports/ui/components/CustomCard/index.js';

import Terms from '../imports/ui/views/Terms/index.js';
import About from '../imports/ui/views/About/index.js';

// The *.mock.js files contains static redux stores configuration with no external dependencies (such as minimongo).
import * as models from "../imports/ui/services/models/index.mock.js";
//https://medium.com/ingenious/storybook-meets-redux-6ab09a5be346

const store = init({
    models
});

storiesOf('Layouts', module)
    .addDecorator(story => <Router>{story()}</Router>)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    /*
    .add('General', () => (
        <General><h4>General Content</h4></General>
    ))
    */
    .add('Card', () => (
        <CustomCard
            headerTitle="This is the card's title"
            headerIcon={<HourglassEmptyIcon />}
            headerFactTitle="Completed this week"
            headerFactValue="9 Pts"
        >
            <h4>General Content</h4>
        </CustomCard>
    ))
    .add('Terms', () => (
        <Terms />
    ))
    .add('About', () => (
        <About />
    ));