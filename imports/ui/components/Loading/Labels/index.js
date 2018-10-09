import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

class UpdatingLabels extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    cancelLoad = () => {
        console.log('cancelLoad');
        this.props.setLoading(false);
    };

    render() {
        const { classes, loading, loadingText } = this.props;
        console.log('LoadingRepos - render()');
        if (loading) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={loading}>
                    <DialogTitle id="simple-dialog-title">Sending updates to Github</DialogTitle>
                    <DialogContent>
                        {loadingText}
                    </DialogContent>
                    <CircularProgress className={classes.progress} />
                    <DialogActions>
                        <Button onClick={this.cancelLoad} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            console.log('Return Null');
            return null;
        }

    }
}

UpdatingLabels.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.labelsEdit.loading,
});

const mapDispatch = dispatch => ({
    setLoading: dispatch.labelsEdit.setLoading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(UpdatingLabels));
