import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
    },
});

class Step4 extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <h2>Some explanations</h2>
                <Typography component="p">
                    By default, the app uses specifically formatted labels (SP:X with X the number of points) to calculate Story Points.
                </Typography>
                <Typography component="p">
                    Your repos need to be configured with those labels, you can do so in the setting section.
                </Typography>
            </div>
        );
    }
}
export default withStyles(styles)(Step4);