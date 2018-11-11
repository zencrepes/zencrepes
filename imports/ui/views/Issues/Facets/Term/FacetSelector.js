import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    root: {

    },
    listItem: {
        padding: '0px',
        height: '20px',
    },
    listItemText: {
        padding: '0px',
    },
    chip: {
        height: '18px',
    },
    checkbox: {
        height: '18px',
        width: '25px',
    }
});

class FacetSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    handleToggle = clickedValue => () => {
        console.log('handleToggle');
        const { clickItem } = this.props;
        clickItem(clickedValue);
        /*
        //check to handle the situation where the group does not exist yet
        let valueChecked = {in:[]};
        if (queryValues[value.group] !== undefined) {
            valueChecked = queryValues[value.group];
        }
        //Check if the value is already in the model, if yes remove, if not add.
        const currentIndex = valueChecked.in.map((v) => {return v}).indexOf(value.name);
        if (currentIndex === -1) {
            addFilterRefresh(value);
        } else {
            removeFilterRefresh(value);
        }
        */
    };

    render() {
        const { data, classes, selected, clickItem, defaultPoints } = this.props;
        //const { value } = this.state;

        let facetItem = data.name;
        if (facetItem.length > 20) {
            facetItem = facetItem.slice(0, 25) + '...';
        }

        return (
            <ListItem
                key={data.name}
                role={undefined}
                dense
                button
                onClick={this.handleToggle(data)}
                //onClick={clickItem(data)}
                className={classes.listItem}
            >
                <Checkbox
                    checked={selected}
                    tabIndex={-1}
                    disableRipple
                    className={classes.checkbox}
                />
                <Tooltip title={data.name}>
                    <ListItemText primary={facetItem} className={classes.listItemText} />
                </Tooltip>
                <ListItemSecondaryAction>
                    <Chip label={defaultPoints ? data.points + ' pts' : data.count + ' tkts'} className={classes.chip} />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

FacetSelector.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(FacetSelector);