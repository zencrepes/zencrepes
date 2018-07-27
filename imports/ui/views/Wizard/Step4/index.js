import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';


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

            </div>
        );
    }
}
export default withStyles(styles)(Step4);