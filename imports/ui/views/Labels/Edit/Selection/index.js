import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import Card from "../../../../components/Card/Card";
import CardHeader from "../../../../components/Card/CardHeader";
import CardBody from "../../../../components/Card/CardBody";

import GridItem from '../../../../components/Grid/GridItem.js';
import GridContainer from '../../../../components/Grid/GridContainer.js';

import dashboardStyle from "../../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';

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
        const { classes, selectedRepos, allRepos, updateSelectedRepos } = this.props;
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
                        <GridItem xs={12} sm={12} md={12}>
                            <DualListBox
                                canFilter
                                options={allRepos}
                                selected={selectedRepos}
                                onChange={(selected) => {
                                    updateSelectedRepos(selected);
                                }}
                            />
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
    selectedRepos: state.labelsEdit.selectedRepos,
    allRepos: state.labelsEdit.allRepos,
});

const mapDispatch = dispatch => ({
    updateSelectedRepos: dispatch.labelsEdit.updateSelectedRepos,
});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(EditSelection));