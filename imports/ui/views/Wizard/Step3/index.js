import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import Selects from '../../../components/Settings/Load/Selects.js';
import IssuesRepartition from './IssuesRepartition.js';
import PropTypes from "prop-types";

const styles = theme => ({
    root: {
    },
});

class Step3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load_issues: true,
            load_labels: true,
            load_milestones: false,
            load_pullrequests: false,
            load_releases: false,
        };
    }

    componentDidMount() {
        for (let key in this.state) {
            // if the key exists in localStorage
            if (localStorage.hasOwnProperty(key)) {
                // get the key's value from localStorage
                let value = localStorage.getItem(key);

                // parse the localStorage string and setState
                try {
                    value = JSON.parse(value);
                    this.setState({ [key]: value });
                } catch (e) {
                    // handle empty string
                    this.setState({ [key]: value });
                }
            }
        }
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        localStorage.setItem(name, event.target.checked);
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
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
