import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';


import Button from '@material-ui/core/Button';

import Card from "../../../../components/Card/Card";
import CardHeader from "../../../../components/Card/CardHeader";
import CardBody from "../../../../components/Card/CardBody";

import GridItem from '../../../../components/Grid/GridItem.js';
import GridContainer from '../../../../components/Grid/GridContainer.js';

import MagnifyIcon from 'mdi-react/MagnifyIcon';
import ArrowLeftBoxIcon from 'mdi-react/ArrowLeftBoxIcon';
import ArrowRightBoxIcon from 'mdi-react/ArrowRightBoxIcon';

import { cfgLabels } from '../../../../data/Minimongo.js';
import { cfgSources } from '../../../../data/Minimongo.js';

import ListAvailable from './ListAvailable.js';
import SearchAvailable from './SearchAvailable.js';
import ListSelected from './ListSelected.js';
import SearchSelected from './SearchSelected.js';

import dashboardStyle from "../../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


class EditSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    addToSelected() {
        const { addToSelected } = this.props;
        addToSelected();
    }

    removeFromSelected() {
        const { addToAvailable } = this.props;
        addToAvailable();
    }

    render() {
        const { classes } = this.props;
        return (
            <Card>
                <CardHeader color="success">
                    <h4 className={classes.cardTitleWhite}>Select Repositories</h4>
                    <p className={classes.cardCategoryWhite}>
                        Changes will be applied only to selected repositories
                    </p>
                </CardHeader>
                <CardBody>
                    <GridContainer>
                        <GridItem xs={5} sm={5} md={5}>
                            <h3>Available Repos</h3>
                            <SearchAvailable />
                            <ListAvailable />
                        </GridItem>
                        <GridItem xs={2} sm={2} md={2}>
                            <h3>Actions</h3>
                            <Button variant="outlined" color="primary" className={classes.button} onClick={() => this.addToSelected()}>
                                <ArrowRightBoxIcon />
                            </Button>
                            <Button variant="outlined" color="primary" className={classes.button} onClick={() => this.removeFromSelected()}>
                                <ArrowLeftBoxIcon />
                            </Button>
                        </GridItem>
                        <GridItem xs={5} sm={5} md={5}>
                            <h3>Selected Repos</h3>
                            <SearchSelected />
                            <ListSelected />
                        </GridItem>
                    </GridContainer>
                </CardBody>
            </Card>
        );
    }
}

EditSelection.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    addToAvailable: dispatch.labelsconfiguration.addToAvailable,
    addToSelected: dispatch.labelsconfiguration.addToSelected
});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(EditSelection));