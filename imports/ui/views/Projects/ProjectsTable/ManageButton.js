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
            project
        } = this.props;
        const projectQuery = {"projectCards.edges":{"$elemMatch":{"node.project.name":{"$in":[project.name]}}}};
        this.props.history.push({
            pathname: '/project',
            search: '?q=' + encodeURIComponent(JSON.stringify(projectQuery)),
            state: { detail: projectQuery }
        });
    };

    render() {
        return (
            <Tooltip title="Open project stats in ZenCrepes">
                <Button onClick={this.openStats} variant="contained" color="primary" >
                    Stats
                </Button>
            </Tooltip>
        );
    }
}

ManageButton.propTypes = {
    project: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ManageButton));


