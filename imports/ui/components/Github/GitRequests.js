import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import { connect } from "react-redux";
import Tooltip from 'material-ui/Tooltip';

const styles = {
    root: {
        flexGrow: 1,
    },
};

class GitRequests extends React.Component {

    state = {
        completed: 0,
    };

    getBarStatus = (limit, remaining) => {
        return Math.round((limit - remaining) * 100 / limit, 10) ;
    }

    render() {
        const { classes, limit, cost, remaining, resetAt } = this.props;
        let tooltipValue = "Tokens: " + remaining + "/" + limit + " (Reset at: " + resetAt + ")";
        return (
            <div className={classes.root}>
                <Tooltip id="tooltip-bottom" title={tooltipValue} placement="bottom">
                    <LinearProgress variant="determinate" value={this.getBarStatus(limit, remaining)} />
                </Tooltip>
                Remaining Github tokens: {remaining} / 5000
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

//export default withStyles(styles)(GitRequests);

const mapState = state => ({
    limit: state.chip.limit,
    cost: state.chip.cost,
    remaining: state.chip.remaining,
    resetAt: state.chip.resetAt,
});

export default connect(mapState, null)(withStyles(styles)(GitRequests));
