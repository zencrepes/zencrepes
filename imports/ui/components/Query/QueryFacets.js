import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';


const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },

});

class QueryFacets extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes, queryContent } = this.props;

        return (
            <div className={classes.root}>
                {queryContent.map(data => {
                        return (
                            <Chip
                                key={data.name}
                                label={data.name}
                                className={classes.chip}
                            />
                        );
                })}
            </div>
        );
    }
}

QueryFacets.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(QueryFacets);
