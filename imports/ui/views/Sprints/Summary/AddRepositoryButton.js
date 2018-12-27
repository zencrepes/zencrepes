import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';

const styles = {
    root: {
        textAlign: 'right'
    },
};
class AddRepositoryButton extends Component {
    constructor (props) {
        super(props);
    }

    addClick = () => {
        console.log('addClick');
        const { setOpenAddRepository, setAddReposSelected } = this.props;
        setAddReposSelected([]);
        setOpenAddRepository(true);
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Button variant="contained" color="primary" size="small" onClick={this.addClick}>
                    Add Repo
                </Button>
            </div>
        )
    };
}

AddRepositoryButton.propTypes = {
    classes: PropTypes.object.isRequired,
    setOpenAddRepository: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setOpenAddRepository: dispatch.sprintsView.setOpenAddRepository,
    setAddReposSelected: dispatch.sprintsView.setAddReposSelected,
});

export default connect(null, mapDispatch)(withStyles(styles)(AddRepositoryButton));
