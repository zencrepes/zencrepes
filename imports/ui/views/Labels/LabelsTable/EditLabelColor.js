import React, { Component } from 'react';
import reactCSS from 'reactcss'

import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import {connect} from "react-redux";

class EditLabelColor extends Component {
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
        setNewColor(color.hex.replace('#', ''));
    };

    render() {
        const { newColor } = this.props;
//        console.log(newColor);

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `${ '#' + newColor }`,
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
            <React.Fragment>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color } />
                </div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ '#' + newColor } onChange={ this.handleChange } />
                </div> : null }
            </React.Fragment>
        );
    }
}

EditLabelColor.propTypes = {
    newColor: PropTypes.string.isRequired,
    setNewColor: PropTypes.func.isRequired,
};

const mapState = state => ({
    updateColor: state.labelsEdit.updateColor,
    newColor: state.labelsEdit.newColor,
});

const mapDispatch = dispatch => ({
    setNewColor: dispatch.labelsEdit.setNewColor,
});

export default connect(mapState, mapDispatch)(EditLabelColor);