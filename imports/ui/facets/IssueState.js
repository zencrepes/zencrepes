import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import CommentIcon from 'material-ui-icons/Comment';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        margin: theme.spacing.unit,
    },
});

class IssueState extends React.Component {
    state = {
        dense: true,
        checked: [0],
    };

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    render() {
        const { classes } = this.props;
        const { dense } = this.state;

        return (
            <div className={classes.root}>
                <List dense={dense}>
                    {this.props.states.map(value => (
                        <ListItem
                            key={value.name}
                            role={undefined}
                            dense
                            button
                            onClick={this.handleToggle(value.name)}
                            className={classes.listItem}
                        >
                            <Checkbox
                                checked={this.state.checked.indexOf(value.name) !== -1}
                                tabIndex={-1}
                                disableRipple
                            />
                            <ListItemText primary={value.name} />
                            <ListItemSecondaryAction>
                                <Chip label={value.issuesCount} className={classes.chip} />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

IssueState.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IssueState);
