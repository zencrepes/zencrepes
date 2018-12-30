import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";

const styles = {
    root: {
        flexGrow: 1,
        margin: '10px',
    },
    actionButtons: {
        textAlign: 'right',
    },
    loading: {
        flexGrow: 1,
    },
};

class Refresh extends Component {
    constructor(props) {
        super(props);
    }

    loadIssues = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    cancelLoad = () => {
        const { setLoading } = this.props;
        setLoading(false);
    };

    render() {
        const { classes, loading } = this.props;
        return (
            <div className={classes.root}>
                {loading &&
                    <div className={classes.loading}>
                        <Button onClick={this.cancelLoad} color="primary" autoFocus>
                            Cancel Load
                        </Button>
                    </div>
                }
                {!loading &&
                    <div className={classes.actionButtons} >
                        <Button color="primary" variant="contained" className={classes.button} onClick={this.loadIssues}>
                            Refresh Issues
                        </Button>
                    </div>
                }
            </div>
        );
    }
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
};

const mapState = state => ({
    loading: state.issuesFetch.loading,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoading: dispatch.issuesFetch.setLoading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));