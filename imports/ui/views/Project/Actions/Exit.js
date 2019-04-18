import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
    },
    button: {
        color: '#fff',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});

class Exit extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    closeProject = () => {
        this.props.history.push({
            pathname: '/projects',
            search: '?q={}',
            state: { detail: {} }
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <Button
                onClick={this.closeProject}
                className={classes.button}
            >
                <CloseIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Exit
            </Button>
        )
    }
}

Exit.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Exit));

