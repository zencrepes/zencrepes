/*
From: https://github.com/creativetimofficial/material-kit-react/blob/master/src/components/Card/CardFooter.jsx
 */
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import cardFooterStyle from "../../assets/jss/material-kit-react/components/cardFooterStyle.jsx";

function CardFooter({ ...props }) {
    const { classes, className, children, ...rest } = props;
    const cardFooterClasses = classNames({
        [classes.cardFooter]: true,
        [className]: className !== undefined
    });
    return (
        <div className={cardFooterClasses} {...rest}>
            {children}
        </div>
    );
}

CardFooter.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default withStyles(cardFooterStyle)(CardFooter);