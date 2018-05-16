import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {

    }
});

class FacetSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

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

    render() {
        const { data, classes, selected } = this.props;
        //const { value } = this.state;

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
                />
                <ListItemText primary={data.name} />
                <ListItemSecondaryAction>
                    <Chip label={data.count} className={classes.chip} />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

FacetSelector.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    addFilterRefresh: dispatch.data.addFilterRefresh,
    removeFilterRefresh: dispatch.data.removeFilterRefresh,
});

const mapState = state => ({
    queryValues: state.data.filters,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(FacetSelector));