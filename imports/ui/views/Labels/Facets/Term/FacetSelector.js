import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';

import SquareIcon from 'mdi-react/SquareIcon';

import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
    root: {

    },
    listItem: {
        padding: '0px',
        height: '20px',
        borderBottom: '1px dashed #e6e6e6',
    },
    listItemText: {
        padding: '0px',
    },
    chip: {
        height: '18px',
    },
    checkbox: {
        height: '15px',
        width: '15px',
        color: blue[500],
        padding: '5px',
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
    };

    render() {
        const { data, classes, selected, clickItem, type } = this.props;
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
                {type === 'color' &&
                    <SquareIcon key={data.name} color={'#' + data.name} />
                }
                <Tooltip title={data.name}>
                    <ListItemText primary={facetItem} className={classes.listItemText} />
                </Tooltip>
                <ListItemSecondaryAction>
                    <Chip label={data.count + ' lbls'} className={classes.chip} />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

FacetSelector.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(FacetSelector);