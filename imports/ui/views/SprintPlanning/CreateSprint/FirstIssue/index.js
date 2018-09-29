import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import SearchIssue from './SearchIssue.js'
import ListIssues from './ListIssues.js'

const styles = theme => ({
    root: {

    }
});

class FirstIssue extends Component {
    constructor (props) {
        super(props);
        this.state = {
            firstIssue: '',
        };
    }

    searchFirstIssue = name => event => {
        this.setState({
            'firstIssue': event.target.value
        });
    };

    render() {
        const { classes, openCreateSprint } = this.props;
        return (
            <div className={classes.root}>
                <SearchIssue />
                <ListIssues />
            </div>
        );
    };
}

FirstIssue.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(FirstIssue));
