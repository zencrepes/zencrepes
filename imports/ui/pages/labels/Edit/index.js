import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';


import MagnifyIcon from 'mdi-react/MagnifyIcon';

import AppMenu from '../../../components/AppMenu/index.js';
import ItemGrid from '../../../components/Grid/ItemGrid.js';
import { cfgLabels } from '../../../data/Labels.js';
import { cfgSources } from '../../../data/Orgs.js';
import {ContentCopy, Update, Warning} from "@material-ui/icons/index";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        paddingTop: 80,
        minWidth: 0, // So the Typography noWrap works
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    card: {
        minWidth: 275,
        margin: 10,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    listroot: {
        width: '100%',
        maxWidth: 360,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
});

class LabelsEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            checked: [],
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        console.log(this.props);

    }

    handleChange = event => {
        this.setState({ name: event.target.value });
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
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <h1>Edit Label: {this.props.match.params.name}</h1>
                    <Link to="/labels"><Button className={classes.button}>Back to List</Button></Link>
                    <Link to={"/labels/view/" + this.props.match.params.name}><Button className={classes.button}>Back Configuration</Button></Link>
                    <Grid container>
                        <ItemGrid xs={12} sm={6} md={6}>
                            <Grid container>
                                <ItemGrid xs={5} sm={5} md={5}>
                                    <h3>Available Repos</h3>
                                    <TextField
                                        label="Search"
                                        id="simple-start-adornment"
                                        className={classNames(classes.margin, classes.textField)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><MagnifyIcon /></InputAdornment>,
                                        }}
                                    />
                                    <List className={classes.listroot}>
                                        {cfgSources.find({}).fetch().map(value => (
                                            <ListItem
                                                key={value.id}
                                                role={undefined}
                                                dense
                                                button
                                                onClick={this.handleToggle(value.id)}
                                                className={classes.listItem}
                                            >
                                                <ListItemText primary={value.name} />
                                            </ListItem>
                                        ))}
                                    </List>

                                </ItemGrid>
                                <ItemGrid xs={2} sm={2} md={2}>
                                    <h3>Actions</h3>
                                    <Button variant="outlined" color="primary" className={classes.button}>
                                        ADD
                                    </Button>
                                    <Button variant="outlined" color="primary" className={classes.button}>
                                        REMOVE
                                    </Button>
                                </ItemGrid>
                                <ItemGrid xs={5} sm={5} md={5}>
                                    <h3>Selected Repos</h3>
                                    <TextField
                                        label="Search"
                                        id="simple-start-adornment"
                                        className={classNames(classes.margin, classes.textField)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><MagnifyIcon /></InputAdornment>,
                                        }}
                                    />
                                </ItemGrid>
                            </Grid>
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={6}>
                            <h2>Actions</h2>
                        </ItemGrid>
                    </Grid>
                </main>
            </div>
        );
    }
}

LabelsEdit.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(LabelsEdit)));