import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class OrgName extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    handleChange = name => event => {
        const { setName } = this.props;
        setName(event.target.value);

    };

    handleScanOrg = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, name } = this.props;
        return (
            <div >
                <TextField
                    id="orgName"
                    label="GitHub Organization"
                    className={classes.textField}
                    value={name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                />
                <Button color="primary" className={classes.button} onClick={this.handleScanOrg}>
                    Scan Org
                </Button>
            </div>
        );
    }
}

OrgName.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loadFlag: state.githubScanOrg.loadFlag,
    name: state.githubScanOrg.name,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubScanOrg.setLoadFlag,
    setName: dispatch.githubScanOrg.setName,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(OrgName));