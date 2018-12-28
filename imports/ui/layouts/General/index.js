import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Header from '../../components/Header/index.js';
import Footer from '../../components/Footer/index.js';

const style = {
    root: {
    },

    fullWidth :{
        width: '100%',
    },

    fullWidthCenter :{
        width: '100%',
//        minHeight: 'calc(100vh - 130px)',
    },
};

class General extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, children } = this.props;
        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={12} sm className={classes.fullWidth}>
                        <Header />
                    </Grid>
                    <Grid item xs={12} sm className={classes.fullWidthCenter}>
                        {children}
                    </Grid>
                    <Grid item xs={12} sm className={classes.fullWidth}>
                        <Footer />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

General.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default withStyles(style)(General);
