import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from '../../components/Header/index.js';
import Footer from '../../components/Footer/index.js';

const style = {
    root: {
        minHeight: '100vh',
    },

    fullWidthCenter :{
        width: '100%',
        minHeight: 'calc(100vh - 130px)',
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
                <CssBaseline />
                <Header />
                <main className={classes.fullWidthCenter}>
                    {children}
                </main>
                <footer>
                    <Footer />
                </footer>
            </div>
        )
    }
}

General.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default withStyles(style)(General);
