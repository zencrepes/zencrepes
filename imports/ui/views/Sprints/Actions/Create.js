import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        textAlign: 'right',
    },
});

class Create extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    createSprint = () => {
        const { setOpenCreateSprint } = this.props;
        setOpenCreateSprint(true);
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button variant="raised" color="primary" className={classes.button} onClick={this.createSprint}>
                    Create New Sprint
                </Button>
            </div>
        )
    };
}

Create.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    setOpenCreateSprint: dispatch.sprintsView.setOpenCreateSprint,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Create));
