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
        width: 200,
    },
    menu: {
        width: '100%',
    },
});

class QueryPicker extends Component {
    constructor(props) {
        super(props);

    }

    handleChange = name => event => {
        console.log(event);
        const { setMongoFilter } = this.props;
        setMongoFilter(event.target.value);
    };

    render() {
        const { classes, queriesList, mongoFilter } = this.props;

        console.log('QueriesList - Mongo Filter: ' + JSON.stringify(mongoFilter));
        return (
            <div className={classes.root}>
                <TextField
                    id="select-query"
                    select
                    label="Select"
                    className={classes.textField}
                    value={mongoFilter}
                    onChange={this.handleChange('query')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {queriesList.map(query => (
                        <MenuItem key={query._id} value={query.mongo}>
                            {query.name}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        );
    }
}

QueryPicker.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default
connect(mapState, mapDispatch)
(
    withTracker(() => {return {queriesList: cfgQueries.find({}).fetch()}})
    (
        withStyles(styles)(QueryPicker)
    )
);


//export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
