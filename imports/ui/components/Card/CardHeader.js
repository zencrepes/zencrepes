/*
From: https://github.com/creativetimofficial/material-kit-react/blob/master/src/components/Card/CardHeader.jsx
 */
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import cardHeaderStyle from "../../assets/jss/material-kit-react/components/cardHeaderStyle.jsx";

function CardHeader({ ...props }) {
    const { classes, className, children, color, plain, ...rest } = props;
    const cardHeaderClasses = classNames({
        [classes.cardHeader]: true,
        [classes[color + "CardHeader"]]: color,
        [classes.cardHeaderPlain]: plain,
        [className]: className !== undefined
    });
    return (
        <div className={cardHeaderClasses} {...rest}>
            {children}
        </div>
    );
}

CardHeader.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    color: PropTypes.oneOf(["warning", "success", "danger", "info", "primary"]),
    plain: PropTypes.bool
};

export default withStyles(cardHeaderStyle)(CardHeader);
