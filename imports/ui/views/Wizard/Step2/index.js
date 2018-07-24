import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import OrgName from './OrgName.js';

import ScanOrg  from "../../../data/ScanOrg.js";


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
                <OrgName/>
            </div>
        );
    }
}
export default withStyles(styles)(Step2);