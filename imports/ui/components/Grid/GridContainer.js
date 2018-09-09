import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import classNames from "classnames";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

const style = {
    grid: {
        margin: "0 -15px !important"
    }
};


class GridContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, children, ...rest } = this.props;
        return (
            <Grid container {...rest} className={classes.grid}>
                {children}
            </Grid>
        );
    }
}

GridContainer.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(style)(GridContainer));
