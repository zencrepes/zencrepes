import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import classNames from "classnames";

import cardBodyStyle from "../../assets/jss/material-dashboard-react/components/cardBodyStyle.jsx";

import PropTypes from "prop-types";

class CardBody extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, className, children, plain, profile, ...rest } = this.props;
        const cardBodyClasses = classNames({
            [classes.cardBody]: true,
            [classes.cardBodyPlain]: plain,
            [classes.cardBodyProfile]: profile,
            [className]: className !== undefined
        });

        return (
            <div className={cardBodyClasses} {...rest}>
                {children}
            </div>
        );
    }
}

CardBody.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    plain: PropTypes.bool,
    profile: PropTypes.bool
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(cardBodyStyle)(CardBody));
