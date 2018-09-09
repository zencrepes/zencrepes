import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

const style = {
    grid: {
        padding: "0 15px !important"
    }
};


class GridItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, children, ...rest } = this.props;
        return (
            <Grid item {...rest} className={classes.grid}>
                {children}
            </Grid>
        );
    }
}

GridItem.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(style)(GridItem));
