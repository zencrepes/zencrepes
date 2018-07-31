import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import classNames from "classnames";

import cardHeaderStyle from "../../assets/jss/material-dashboard-react/components/cardHeaderStyle.jsx";

import PropTypes from "prop-types";

class CardHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            classes,
            className,
            children,
            color,
            plain,
            stats,
            icon,
            ...rest
        } = this.props;

        const cardHeaderClasses = classNames({
            [classes.cardHeader]: true,
            [classes[color + "CardHeader"]]: color,
            [classes.cardHeaderPlain]: plain,
            [classes.cardHeaderStats]: stats,
            [classes.cardHeaderIcon]: icon,
            [className]: className !== undefined
        });

        return (
            <div className={cardHeaderClasses} {...rest}>
                {children}
            </div>
        );
    }
}

CardHeader.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    color: PropTypes.oneOf([
        "warning",
        "success",
        "danger",
        "info",
        "primary",
        "rose"
    ]),
    plain: PropTypes.bool,
    stats: PropTypes.bool,
    icon: PropTypes.bool
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(cardHeaderStyle)(CardHeader));
