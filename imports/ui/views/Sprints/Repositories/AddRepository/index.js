import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import SearchRepositories from './SearchRepositories';
import ListRepositories from './ListRepositories';

const styles = theme => ({
    root: {
    }
});

class AddRepository extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    close = () => {
        const { setOpenAddRepository } = this.props;
        setOpenAddRepository(false);
    };

    render() {
        const { classes, openAddRepository } = this.props;
        if (openAddRepository) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openAddRepository}>
                    <DialogTitle id="simple-dialog-title">Add Repository</DialogTitle>
                    <DialogContent>
                        <SearchRepositories />
                        <ListRepositories />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.close} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return null;
        }

    };
}

AddRepository.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    openAddRepository: state.sprintsView.openAddRepository,
});

const mapDispatch = dispatch => ({
    setOpenAddRepository: dispatch.sprintsView.setOpenAddRepository,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(AddRepository));
