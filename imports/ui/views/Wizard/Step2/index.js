import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import ItemGrid from '../../../components/Grid/ItemGrid.js';

import ScanOrg  from '../../../data/ScanOrg.js';
import ScanRepo  from '../../../data/ScanRepo.js';

import Org from './Org/index.js';
import Repo from './Repo/index.js';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';


const styles = theme => ({
    root: {
    },
});

class Step2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <ScanOrg/>
                <ScanRepo/>
                <Grid container>
                    <ItemGrid xs={12} sm={6} md={6}>
                        <Org/>
                        <Repo/>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={6} md={6}>
                        <Typography component="p">
                            There are a few reason why loading might return an empty set of results. The most common is simply that you don't have permission to access this Organization's repository
                        </Typography>
                        <Typography component="p">
                            The other reason might be that the organization has enabled OAuth App access restrictions, meaning that data access to third-parties is limited. For more information on these restrictions, including how to whitelist this app, visit https://help.github.com/articles/restricting-access-to-your-organization-s-data/
                        </Typography>
                    </ItemGrid>
                </Grid>
            </div>
        );
    }
}

Step2.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Step2));