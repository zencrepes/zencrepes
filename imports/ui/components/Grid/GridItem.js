/*
From: https://github.com/creativetimofficial/material-kit-react/blob/master/src/components/Grid/GridItem.jsx
 */
import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

const style = {
    grid: {
        position: "relative",
        width: "100%",
        minHeight: "1px",
        paddingRight: "15px",
        paddingLeft: "15px",
        flexBasis: "auto"
    }
};

function GridItem({ ...props }) {
    const { classes, children, className } = props;
    return (
        <Grid item className={classes.grid + " " + className}>
            {children}
        </Grid>
    );
}

export default withStyles(style)(GridItem);