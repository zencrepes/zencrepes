import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { connect } from "react-redux";


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

const mapStateToProps = state => {
    return {
        facetState: state.facetState,
    }
};

class IssueState extends React.Component {
    constructor (props) {
        super(props);
    }

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
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        States
                    </Typography>
                </Toolbar>
                <List dense={dense}>
                    {this.props.facetState.map(value => (
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

export default connect(mapStateToProps)(withStyles(styles)(IssueState));
