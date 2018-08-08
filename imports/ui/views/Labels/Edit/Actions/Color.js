import _ from 'lodash';

import React, { Component } from 'react';
import reactCSS from 'reactcss'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import { SketchPicker } from 'react-color'

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({

});

class LabelColor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false
        };
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        const { setNewColor } = this.props;
        setNewColor(color.hex);
    };

    handleToggle = value => () => {
        const { setUpdateColor } = this.props;
        if (value === true) {setUpdateColor(false);}
        else {setUpdateColor(true);}
    };

    render() {
        const { classes, updateColor, newColor } = this.props;

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `${ newColor }`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
        return (
            <ListItem >
                <ListItemIcon>
                    <div style={ styles.swatch } onClick={ this.handleClick }>
                        <div style={ styles.color } />
                    </div>
                </ListItemIcon>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ newColor } onChange={ this.handleChange } />
                </div> : null }
                <ListItemText primary="Label Color" />
                <ListItemSecondaryAction>
                    <Switch
                        onChange={this.handleToggle(updateColor)}
                        checked={updateColor}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

LabelColor.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    updateColor: state.labelsconfiguration.updateColor,
    newColor: state.labelsconfiguration.newColor,
});

const mapDispatch = dispatch => ({
    setUpdateColor: dispatch.labelsconfiguration.setUpdateColor,
    setNewColor: dispatch.labelsconfiguration.setNewColor,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LabelColor));