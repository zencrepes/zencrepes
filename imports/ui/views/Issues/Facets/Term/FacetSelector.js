import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import blue from '@material-ui/core/colors/blue';

const styles = {
    root: {

    },
    listItem: {
        marginLeft: '5px',
        padding: '0px',
        height: '20px',
        borderBottom: '1px dashed #e6e6e6',
    },
    listItemText: {
        marginLeft: '5px',
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
};

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
        const { data, classes, selected, defaultPoints } = this.props;

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
    data: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    clickItem: PropTypes.func.isRequired,
};

export default withStyles(styles)(FacetSelector);