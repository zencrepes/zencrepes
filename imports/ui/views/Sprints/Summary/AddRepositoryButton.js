import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class AddRepositoryButton extends Component {
    constructor (props) {
        super(props);
    }

    addClick = () => {
        console.log('addClick');
        const { setOpenAddRepository, setAddReposSelected } = this.props;
        setAddReposSelected([]);
        setOpenAddRepository(true);
        /*
        const { setLoadFlag } = this.props;
        setLoadFlag({
            issues: 'true',
            labels: 'false'
        });
        */
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Button variant="raised" color="primary" size="small" className={classes.button} onClick={this.addClick}>
                    Add Repo
                </Button>
            </div>
        )
    };
}

AddRepositoryButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    setOpenAddRepository: dispatch.sprintsView.setOpenAddRepository,
    setAddReposSelected: dispatch.sprintsView.setAddReposSelected,

});


export default connect(mapState, mapDispatch)(withStyles(styles)(AddRepositoryButton));
