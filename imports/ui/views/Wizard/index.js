import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

class Wizard extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <h1>Wizard (General)</h1>
            </div>
        );
    }
}
export default withStyles(styles)(Wizard);