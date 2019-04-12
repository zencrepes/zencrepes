import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import General from "../../layouts/General/index.js";
import PropTypes from "prop-types";

import EmptyActions from '../../components/EmptyActions/index.js';


const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    appBar: {
        position: 'relative',
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
            width: 1000,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    title: {
        fontSize: '52px',
        lineHeight: 1.3,
    },
    underline: {
        margin: '18px 0',
        width: '100px',
        borderWidth: '2px',
        borderColor: '#27A0B6',
        borderTopStyle: 'solid',
    },
    subtitle: {
        fontSize: '20px',
        fontFamily: 'Roboto',
        fontWeight: 400,
        lineHeight: 1.5,
    },
    paragraph: {
        color: '#898989',
        lineHeight: 1.75,
        fontSize: '16px',
        margin: '0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
    paragraphSmall: {
        color: '#898989',
        lineHeight: 1,
        fontSize: '14px',
        margin: '10px 0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
    secondTitle: {
        fontSize: '20px',
        lineHeight: 1.1,
        fontWeight: 600,
        letterSpacing: '.75px',
    },
    preText: {
        whiteSpace: 'pre-wrap',
    }
});

class Terms extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <General>
                <EmptyActions />
                <main className={classes.layout}>
                    <h1 className={classes.title}>Terms and Conditions</h1>
                    <div>
                        <hr className={classes.underline} />
                    </div>
                    <p className={classes.paragraph}>You are using ZenCrepes at <u><b>your own risks</b></u>, ZenCrepes is provided with absolutely no warranty, NONE !</p>
                    <p className={classes.paragraph}>ZenCrepes allow its users to batch modify content in GitHub through provided APIs, again, you are doing so at your own risks.</p>
                    <p className={classes.paragraph}>ZenCrepes is Open-Source and distributed under the LGPL 2.1: </p>
                    <pre className={classes.preText} >This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.</pre>

                    <pre className={classes.preText} >This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.</pre>

                    <pre className={classes.preText} >You should have received a copy of the GNU Lesser General Public
    License along with this library.  If not, see https://www.gnu.org/licenses/.</pre>
                    <p className={classes.paragraph}>ZenCrepes is not affiliated with GitHub.</p>
                </main>
            </General>
        );
    }
}

Terms.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Terms);
