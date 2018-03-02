import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTracker } from 'meteor/react-meteor-data';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Header from './Header';
import Table from './Table';

export default class App extends Component {
    render() {
        return (
            <div className="container">
                <Header />
                <table>
                    <tbody>
                    <tr>
                        <td width="100">Some facets</td>
                        <td width="100%"><Table /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
