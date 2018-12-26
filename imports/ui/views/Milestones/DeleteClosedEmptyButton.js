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
class DeleteClosedEmptyButton extends Component {
    constructor (props) {
        super(props);
    }

    deleteClosedEmpty = () => {
        /*
        console.log('deleteClosedEmpty');
        const { milestones, setLoadFlag, setMilestones, setAction } = this.props;
        console.log('TODO- THIS ACTION IS CURRENTLY COMMENTED OUT !')
        console.log(milestones);
        console.log(milestones.filter(m => m.state.toLowerCase() === 'closed').filter(m => m.issues.totalCount === 0));
//        setMilestones(milestonesdata.milestones.filter(m => m.state.toLowerCase() === 'closed').filter(m => m.issues.totalCount === 0));
//        setAction('deleteClosedEmpty');
//        setLoadFlag(true);
        */
    };

    render() {
        const { classes, loading } = this.props;

        return (
            <div className={classes.root}>
                {!loading &&
                    <div>
                        <Button variant="contained" color="primary" className={classes.button} onClick={this.deleteClosedEmpty}>
                            Deleted closed and empty Milestones
                        </Button>
                    </div>
                }
            </div>
        );
    };
}

DeleteClosedEmptyButton.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    milestones: PropTypes.array.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
};

const mapState = state => ({
    loading: state.milestonesFetch.loading,
    milestones: state.milestonesView.milestones,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesFetch.setLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(DeleteClosedEmptyButton));
