import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

const styles = {
    root: {
        flexGrow: 1,
    },
};

class GitRequests extends React.Component {
    state = {
        completed: 0,
    };

    componentDidMount() {
        this.timer = setInterval(this.progress, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    timer = null;

    progress = () => {
        const { completed } = this.state;
        if (completed === 100) {
            this.setState({ completed: 0 });
        } else {
            const diff = Math.random() * 10;
            this.setState({ completed: Math.round(Math.min(completed + diff, 100), 1) });
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <LinearProgress variant="determinate" value={this.state.completed} />
                {this.state.completed}
            </div>
        );
    }
}

GitRequests.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GitRequests);