import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {cfgIssues} from "../../../../data/Minimongo";

const styles = theme => ({
    root: {
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    highlight: {
        background: 'rgba(0, 0, 0, 0.07)',
    },
});

class ListIssues extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleToggle = value => () => {
        const { setSearchIssue, setSelectedIssue } = this.props;
        setSearchIssue('');
        setSelectedIssue(value.id);
    };
    

    render() {
        const { classes, searchIssue } = this.props;

        let filteredIssues = [];
        if (searchIssue !== '') {
            filteredIssues = _.filter(cfgIssues.find({'state': { $eq : 'OPEN' }}).fetch(), function(issue) {
                if (issue.number.toString().toLowerCase().indexOf(searchIssue.toLowerCase()) !== -1) {return true;}
                else if (issue.title.toLowerCase().indexOf(searchIssue.toLowerCase()) !== -1) {return true;}
                else if (issue.org.name.toString().toLowerCase().indexOf(searchIssue.toLowerCase()) !== -1) {return true;}
                else if (issue.org.login.toString().toLowerCase().indexOf(searchIssue.toLowerCase()) !== -1) {return true;}
                else if (issue.repo.name.toString().toLowerCase().indexOf(searchIssue.toLowerCase()) !== -1) {return true;}
                else {return false;}
            });
        }
        return (
            <List className={classes.root}>
                {filteredIssues.map(issue => (
                    <ListItem
                        key={issue.id}
                        role={undefined}
                        dense
                        button
                        onClick={this.handleToggle(issue)}
                    >
                        <ListItemText primary={issue.title + " (" + issue.org.login + "/" + issue.repo.name + "#"+ issue.number + ")"} />
                    </ListItem>
                ))}
            </List>
        );
    }
}

ListIssues.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    searchIssue: state.sprintPlanning.searchIssue,

});

const mapDispatch = dispatch => ({
    setSearchIssue: dispatch.sprintPlanning.setSearchIssue,
    setSelectedIssue: dispatch.sprintPlanning.setSelectedIssue,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(ListIssues));