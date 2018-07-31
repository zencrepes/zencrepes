import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import classNames from "classnames";

import cardFooterStyle from "../../assets/jss/material-dashboard-react/components/cardFooterStyle.jsx";

import PropTypes from "prop-types";

class CardFooter extends Component {
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
            stats,
            chart,
            ...rest
        } = this.props;
        const cardFooterClasses = classNames({
            [classes.cardFooter]: true,
            [classes.cardFooterPlain]: plain,
            [classes.cardFooterProfile]: profile,
            [classes.cardFooterStats]: stats,
            [classes.cardFooterChart]: chart,
            [className]: className !== undefined
        });

        return (
            <div className={cardFooterClasses} {...rest}>
                {children}
            </div>
        );
    }
}

CardFooter.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    plain: PropTypes.bool,
    profile: PropTypes.bool,
    stats: PropTypes.bool,
    chart: PropTypes.bool
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(cardFooterStyle)(CardFooter));
