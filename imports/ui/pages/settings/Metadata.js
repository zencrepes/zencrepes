import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import { withTracker } from 'meteor/react-meteor-data';
import axios from 'axios';

import Button from '@material-ui/core/Button';

const styles = {
    root: {
        flexGrow: 1,
    },
    card: {
        minWidth: 10,
    },
    wrapper: {
        margin: 10,
        position: 'relative',
    },
};

class Metadata extends Component {
    constructor(props) {
        super(props);
    };

    loadMetadata() {
        console.log('loadMetadata()');
        //Make get call to: https://api.waffle.io/overture-stack/roadmap/cards
        axios({
            method:'get',
            url:'https://api.waffle.io/overture-stack/roadmap/cards',
            responseType:'json'
        }).then(function(response) {
            console.log(response);
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="raised" size="small" color="primary" onClick={this.loadMetadata}>
                Load Metadata
            </Button>
        );
    }
}

export default withStyles(styles)(Metadata);