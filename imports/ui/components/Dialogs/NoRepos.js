import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

class NoRepos extends React.Component {
    state = {
        open: true,
    };

    render() {
        const { totalRepos } = this.props;

        return (
            <div>
                <Dialog
                    open={this.state.open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"App not configured"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You have access to {totalRepos} repositories. But none are enabled, please do so in Settings.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Link to="/settings">
                            <Button color="primary" autoFocus>
                                Go to Settings
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapState = state => ({
    totalRepos: state.github.totalRepos,
});

export default connect(mapState, null)(NoRepos);