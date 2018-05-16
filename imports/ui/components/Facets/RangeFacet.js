import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles, createGenerateClassName } from 'material-ui/styles';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import InputRange from 'react-input-range'; //https://github.com/davidchin/react-input-range
import 'react-input-range/lib/css/index.css';
import { connect } from "react-redux";

import InputRangeFacet from './InputRangeFacet.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class RangeFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: { min: 2, max: 10 },
        };
    }
/*
    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate');
        if (nextProps.data !== undefined && nextProps.data.length > 0 ) {return true;}
        else {return false;}
    }
*/
    handleToggle = value => () => {
        const { addFilterRefresh, removeFilterRefresh, queryValues } = this.props;

        //check to handle the situation where the group does not exist yet
        let valueChecked = [];
        if (queryValues[value.group] !== undefined) {
            valueChecked = queryValues[value.group];
        }
        //Check if the value is already in the model, if yes remove, if not add.
        const currentIndex = valueChecked.map((v) => {return v.name}).indexOf(value.name);
        if (currentIndex === -1) {
            addFilterRefresh(value);
        } else {
            removeFilterRefresh(value);
        }
    };

    getMax = (data) => {
        if (data.length > 0)
            return Math.max.apply(Math, data.map(x =>  Number.parseInt(x.name) || 0 ));
        else
            return 1;
    };
    getMin = (data) => {
        if (data.length > 0)
            return Math.min.apply(Math, data.map(x =>  Number.parseInt(x.name) || 0 ));
        else
            return 0;
    };

    render() {
        console.log('Facet render()');
        const { classes, facet, queryValues } = this.props;
        const { collapsed } = this.state;
        const {header, group, nested, data } = facet;
        console.log(data);
        console.log('Min: ' + this.getMin(data));
        console.log('Max: ' + this.getMax(data));
        return (
            <div className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        {header}
                    </Typography>
                </Toolbar>
                <InputRangeFacet />
            </div>
        );
    }
}

/*
 <InputRange
 draggableTrack
 minValue={this.getMin(data)}
 maxValue={this.getMax(data)}
 value={0}
 onChange={value => this.setState({ value })}
 />
 */

RangeFacet.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    addFilterRefresh: dispatch.data.addFilterRefresh,
    removeFilterRefresh: dispatch.data.removeFilterRefresh,
});

const mapState = state => ({
    queryValues: state.data.filters,
});
export default connect(mapState, mapDispatch)(withStyles(styles)(RangeFacet));
