/*
From: https://github.com/creativetimofficial/material-kit-react/blob/master/src/components/Grid/GridContainer.jsx
 */
import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

const style = {
    grid: {
        marginRight: "-15px",
        marginLeft: "-15px",
        width: "auto"
    }
};

function GridContainer({ ...props }) {
    const { classes, children, className } = props;
    return (
        <Grid container className={classes.grid + " " + className}>
            {children}
        </Grid>
    );
}

GridContainer.defaultProps = {
    className: ""
};

GridContainer.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string
};

export default withStyles(style)(GridContainer);