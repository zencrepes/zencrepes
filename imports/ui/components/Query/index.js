import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
});

class Query extends Component {

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <h3>Filtered Query</h3>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Query.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Query);
