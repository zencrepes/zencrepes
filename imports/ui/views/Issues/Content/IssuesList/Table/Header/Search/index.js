import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField/TextField";

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class Search extends Component {
    constructor (props) {
        super(props);
    }

    changeSearchField = name => event => {
        console.log('changeSearchField');
        const { searchIssues } = this.props;
        let searchString = event.target.value;
        searchIssues(searchString);
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <TextField
                    id="full-width"
                    label="Search string"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.textField}
                    fullWidth
                    margin="normal"
                    onChange={this.changeSearchField()}
                />
            </div>
        );
    }
}

Search.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    searchIssues: dispatch.issuesView.searchIssues,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Search));
