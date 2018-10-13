import _ from 'lodash';

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

const styles = theme => ({
    root: {
    }
});

//Logic for typing frequency found here: https://gist.github.com/krambertech/76afec49d7508e89e028fce14894724c
class SearchIssue extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchValue: ''
        };

        this.timer = null;
    }

    searchFirstIssue = name => event => {
        const { setSearchIssue } = this.props;
        clearTimeout(this.timer);

        this.setState({searchValue:event.target.value });

        this.timer = setTimeout(this.pushChange, 500);
    };

    pushChange = () => {
        const { setSearchIssue, setSelectedIssue } = this.props;
        const { searchValue } = this.state;
        setSearchIssue(searchValue);
        if (searchValue === '') {
            setSelectedIssue(null);
        }
    }

    render() {
        const { classes, openCreateSprint } = this.props;
        return (
            <div className={classes.root}>
                <TextField
                    id="full-width"
                    label="Search for an issue to initialize the sprint with"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.textField}
                    fullWidth
                    margin="normal"
                    onChange={this.searchFirstIssue()}
                />
            </div>
        );
    };
}

SearchIssue.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    setSearchIssue: dispatch.sprintsView.setSearchIssue,
    setSelectedIssue: dispatch.sprintsView.setSelectedIssue,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SearchIssue));
