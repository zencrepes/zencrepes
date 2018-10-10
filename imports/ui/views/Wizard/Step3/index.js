import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import Selects from '../../../components/Settings/Load/Selects.js';
import IssuesRepartition from './IssuesRepartition.js';
import PropTypes from "prop-types";

import IssuesFetch from '../../../data/Issues/Fetch/index.js';

const styles = theme => ({
    root: {
    },
});

class Step3 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <IssuesFetch />
                <Typography component="p">
                    Aside facilitating planning, this tool was also created to facilitate cross-repos and cross-orgs consistency. To do so it needs to load a bunch of data.
                </Typography>
                <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                        <Selects/>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                        <IssuesRepartition />
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

Step3.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Step3);
