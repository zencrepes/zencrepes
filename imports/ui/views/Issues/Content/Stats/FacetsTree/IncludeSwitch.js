import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Switch from '@material-ui/core/Switch';

const styles = {
    root: {
        textAlign: 'right'
    },
};
class PointsSwitch extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    handleChange = (event) => {
        const { setInclude } = this.props;
        setInclude(event.target.checked);
    };

    render() {
        const { classes, exclude } = this.props;
        return (
            <div className={classes.root}>
                On click: Include
                <Switch
                    checked={exclude}
                    size="small"
                    onChange={this.handleChange}
                />
                Exclude
            </div>
        )
    }
}

PointsSwitch.propTypes = {
    classes: PropTypes.object.isRequired,
    exclude: PropTypes.bool.isRequired,
    setInclude: PropTypes.func.isRequired,
};

export default withStyles(styles)(PointsSwitch);
