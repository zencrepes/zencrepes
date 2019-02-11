import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Input from '@material-ui/core/Input';
import {withStyles} from "@material-ui/core";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";

const styles = {
    root: {
        width: '100%',
        margin: '10px',
    },
    title: {
        fontSize: 14,
    },
    details: {
        fontSize: 12,
    },
    input: {
        width: '100%',
    },

};

class OrgRepos extends Component {
    constructor(props) {
        super(props);
    }

    loadRepos = () => {
        const { setLoadFlag, initView, setOnSuccess } = this.props;
        setOnSuccess(initView);
        setLoadFlag(true);
    };

    handleChange = (event) => {
        const { setOrgName } = this.props;
        setOrgName(event.target.value);
    };

    render() {
        const { classes, loading, orgName } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary">
                        Repositories from an Organization
                    </Typography>
                    <Typography className={classes.details} color="textPrimary">
                        Fetch all repositories attached to a specific organization. The organization must be configured allow such an operation.
                    </Typography>
                    <Input
                        placeholder="Organzation name"
                        inputProps={{
                            'aria-label': 'Description',
                        }}
                        value={orgName}
                        className={classes.input}
                        onChange={this.handleChange}
                    />
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={this.loadRepos} disabled={loading}>
                        Scan
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

OrgRepos.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    orgName: PropTypes.string,
    setOrgName: PropTypes.func.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    initView: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgRepos.setLoadFlag,
    setOrgName: dispatch.githubFetchOrgRepos.setName,

    initView: dispatch.settingsView.initView,
    setOnSuccess: dispatch.loading.setOnSuccess,
});


const mapState = state => ({
    orgName: state.githubFetchOrgRepos.name,
    loading: state.loading.loading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(OrgRepos));
