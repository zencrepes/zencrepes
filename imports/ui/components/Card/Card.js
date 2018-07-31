import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import classNames from "classnames";

import cardStyle from "../../assets/jss/material-dashboard-react/components/cardStyle.jsx";

import PropTypes from "prop-types";

class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            classes,
            className,
            children,
            plain,
            profile,
            chart,
            ...rest
        } = this.props;

        const cardClasses = classNames({
            [classes.card]: true,
            [classes.cardPlain]: plain,
            [classes.cardProfile]: profile,
            [classes.cardChart]: chart,
            [className]: className !== undefined
        });

        return (
            <div className={cardClasses} {...rest}>
                {children}
            </div>
        );
    }
}

Card.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    plain: PropTypes.bool,
    profile: PropTypes.bool,
    chart: PropTypes.bool
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(cardStyle)(Card));
