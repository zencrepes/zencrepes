import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import dashboardStyle from "../../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from '../../../components/Sidebar/index.js';
import Footer from '../../../components/Footer/Footer.js';
import Header from '../../../components/Header/index.js';

import PropTypes from "prop-types";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import {cfgLabels} from "../../../data/Minimongo";
import LabelsTable from './LabelsTable.js';

class LabelsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            labels: [],
            colors: [],
            descriptions: [],
        };
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    componentDidMount() {
        console.log('componentDidMount');
        let label = this.props.match.params.name;
        let similarLabels = cfgLabels.find({'name': label}).fetch();

        let colorElements = _.groupBy(similarLabels, 'color');
        let colors = Object.keys(colorElements).map(idx => {return {
            items: colorElements[idx],
            count: colorElements[idx].length,
            name: "#" + colorElements[idx][0].color,
        }});
        colors = _.sortBy(colors, [function(o) {return o.count;}]);
        colors = colors.reverse();

        let descriptionsElements = _.groupBy(similarLabels, 'description');
        let descriptions = Object.keys(descriptionsElements).map(idx => {return {
            items: descriptionsElements[idx],
            count: descriptionsElements[idx].length,
            name: descriptionsElements[idx][0].description,
        }});
        descriptions = _.sortBy(descriptions, [function(o) {return o.count;}]);
        descriptions = descriptions.reverse();

        this.setState({labels: similarLabels, colors: colors, descriptions: descriptions/*, orgs: orgs*/});
    }

    render() {
        const { classes } = this.props;
        const { labels, colors, descriptions } = this.state;

        return (
            <div className={classes.wrapper}>
                <Sidebar
                    logoText={"Zen Crepes"}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color="blue"
                />
                <div className={classes.mainPanel} ref="mainPanel">
                    <Header
                        handleDrawerToggle={this.handleDrawerToggle}
                        pageName={"Configure Label: " + this.props.match.params.name}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <Link to="/labels"><Button className={classes.button}>Back to List</Button></Link>
                            <Link to={"/labels/edit/" + this.props.match.params.name + "/all"}><Button className={classes.button}>Bulk Change</Button></Link>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <LabelsTable labelsdata={labels} />
                                </GridItem>
                            </GridContainer>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

LabelsView.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(LabelsView)));
