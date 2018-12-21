import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from "react-redux";
import Tooltip from '@material-ui/core/Tooltip';
import Moment from 'react-moment';

const styles = {
    root: {
        flexGrow: 1,
    },
    legend: {
        fontSize: '11px',
        fontFamily: 'Roboto',
    }
};

class GitRequests extends React.Component {

    state = {
        completed: 0,
    };

    getBarStatus = (limit, remaining) => {
        return Math.round((limit - remaining) * 100 / limit, 10) ;
    };

    render() {
        const { classes, limit, cost, remaining, resetAt } = this.props;
        return (
            <div className={classes.root}>
                <span className={classes.legend}>Available GitHub points: {remaining} / 5000
                    {resetAt !== null &&
                        <React.Fragment>
                            , counter will reset on <Moment format="ddd MMM. D">{resetAt}</Moment> at <Moment format="h:mm a">{resetAt}</Moment>
                        </React.Fragment>
                    }
                </span>
                <LinearProgress variant="determinate" value={this.getBarStatus(limit, remaining)} />
            </div>
        );
    }
}

GitRequests.propTypes = {
    classes: PropTypes.object.isRequired,
    limit: PropTypes.number,
    cost: PropTypes.number,
    remaining: PropTypes.number,
    resetAt: PropTypes.string,
};

const mapState = state => ({
    limit: state.chip.limit,
    cost: state.chip.cost,
    remaining: state.chip.remaining,
    resetAt: state.chip.resetAt,
});

export default connect(mapState, null)(withStyles(styles)(GitRequests));
