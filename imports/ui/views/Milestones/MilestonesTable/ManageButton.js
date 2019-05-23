import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core";

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {
    selectedField: {
        color: '#fff',
        width: '300px',
    }
};

class ManageButton extends Component {
    constructor (props) {
        super(props);
    }

    openStats = () => {
        const {
            milestone
        } = this.props;
        const projectQuery = {'milestone.title':{'$eq':milestone.title}};
        this.props.history.push({
            pathname: '/milestone',
            search: '?q=' + encodeURIComponent(JSON.stringify(projectQuery)),
            state: { detail: projectQuery }
        });
    };

    render() {
        return (
            <Tooltip title="Open milestone stats in ZenCrepes">
                <Button onClick={this.openStats} variant="contained" color="primary" >
                    Stats
                </Button>
            </Tooltip>
        );
    }
}

ManageButton.propTypes = {
    milestone: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ManageButton));


