import React from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 600,
    }
});

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            completed: 0,
            buffer: 10,
        };
    }

    componentDidMount() {
        this.timer = setInterval(this.progress, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    timer = null;

    progress = () => {
        const { completed } = this.state;
        if (completed > 100) {
            this.setState({ completed: 0, buffer: 10 });
        } else {
            const diff = Math.random() * 10;
            const diff2 = Math.random() * 10;
            this.setState({ completed: completed + diff, buffer: completed + diff + diff2 });
        }
    };

    render() {
        const { classes } = this.props;
        const { completed, buffer } = this.state;
        return (
            <div className={classes.root}>
                <LinearProgress color="secondary" variant="buffer" value={completed} valueBuffer={buffer} />
            </div>
        );
    }
}

ProgressBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});

const mapState = state => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(ProgressBar));