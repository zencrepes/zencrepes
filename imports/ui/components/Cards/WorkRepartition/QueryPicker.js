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

        this.state = {query: [{name: 'default', mongo: '{}'}]};
    }

    handleChange = name => event => {
        this.props.setMongoFilter(JSON.parse(event.target.value));
        this.props.setLoadFlag(true);
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
                    label="Select"
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
    setMongoFilter: dispatch.repartition.setMongoFilter,
    setLoadFlag: dispatch.repartition.setLoadFlag,

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
