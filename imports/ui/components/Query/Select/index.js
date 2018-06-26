import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import { cfgQueries } from '../../../data/Queries.js';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
    menu: {
        width: '100%',
    },
});

class QuerySelect extends Component {
    constructor(props) {
        super(props);

        this.state = {query: ''};
    }

    handleChange = name => event => {
        console.log('Dashboard - QueryPicker - handleChange');
        //const { setRepartitionFilter, setRepartitionLoadFlag, setVelocityFilter, setVelocityLoadFlag, setRemainingFilter, setRemainingLoadFlag, setFilters } = this.props;
        const { setFilters } = this.props;
        let selectedQuery = cfgQueries.findOne({_id: event.target.value});
        if (selectedQuery !== undefined) {
            setFilters(JSON.parse(selectedQuery.filters));

            /*
            //TODO- To be removed
            setRepartitionFilter(JSON.parse(selectedQuery.filters));
            setRepartitionLoadFlag(true);
            setVelocityFilter(JSON.parse(selectedQuery.filters));
            setVelocityLoadFlag(true);
            setRemainingFilter(JSON.parse(selectedQuery.filters));
            setRemainingLoadFlag(true);
            */
        } else {
            console.log('handleChange - UNABLE TO FIND QUERY');
        }
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { classes, queriesList } = this.props;
        return (
            <div className={classes.root}>
                <TextField
                    id="select-query"
                    select
                    label="Select a Query"
                    className={classes.textField}
                    value={this.state.query}
                    onChange={this.handleChange('query')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {queriesList.map(query => (
                        <MenuItem key={query._id} value={query._id}>
                            {query.name}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        );
    }
}

QuerySelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setRepartitionFilter: dispatch.repartition.setFilter,
    setRepartitionLoadFlag: dispatch.repartition.setLoadFlag,
    setVelocityFilter: dispatch.velocity.setFilter,
    setVelocityLoadFlag: dispatch.velocity.setLoadFlag,
    setRemainingFilter: dispatch.remaining.setFilter,
    setRemainingLoadFlag: dispatch.remaining.setLoadFlag,
    setFilters: dispatch.queries.setFilters,
});

const mapState = state => ({

});

export default
    connect(mapState, mapDispatch)
    (
        withTracker(() => {return {queriesList: cfgQueries.find({}).fetch()}})
        (
            withStyles(styles)(QuerySelect)
        )
    );


//export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
