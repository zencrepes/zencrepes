import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';


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
                <h2>Step 2</h2>
            </div>
        );
    }
}
export default withStyles(styles)(Step2);