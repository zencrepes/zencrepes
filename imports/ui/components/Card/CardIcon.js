import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import classNames from "classnames";

import cardIconStyle from "../../assets/jss/material-dashboard-react/components/cardIconStyle.jsx";

import PropTypes from "prop-types";

class CardIcon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, className, children, color, ...rest } = this.props;
        const cardIconClasses = classNames({
            [classes.cardIcon]: true,
            [classes[color + "CardHeader"]]: color,
            [className]: className !== undefined
        });

        return (
            <div className={cardIconClasses} {...rest}>
                {children}
            </div>
        );
    }
}

CardIcon.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    color: PropTypes.oneOf([
        "warning",
        "success",
        "danger",
        "info",
        "primary",
        "rose"
    ])
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(cardIconStyle)(CardIcon));
