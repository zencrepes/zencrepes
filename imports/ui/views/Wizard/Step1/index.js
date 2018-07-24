import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import ItemGrid from '../../../components/Grid/ItemGrid.js';

import Loading from './Loading.js';
import Treeview from './Treeview.js';
import Stats from './Stats.js';

const styles = theme => ({
    root: {
    },
});

class Step1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    }

    render() {
        const { classes, loading } = this.props;
        if (loading) {
            return (<Loading/>);
        } else {
            return (
                <div>
                    <Grid container>
                        <ItemGrid xs={12} sm={6} md={6}>
                            <Treeview />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={6}>
                            <Stats />
                        </ItemGrid>
                    </Grid>

                </div>
            );
        }
    }
}

Step1.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loading: state.githubRepos.reposLoadingFlag,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubRepos.setReposLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Step1));