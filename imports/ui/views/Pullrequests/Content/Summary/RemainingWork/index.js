import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from "../../../../../components/CustomCard/index.js";

import ReposTreemap from "./ReposTreemap";

class RemainingWork extends Component {
    constructor (props) {
        super(props);
    }

    getDefaultRemaining() {
        const { defaultPoints, remainingWorkPoints, remainingWorkCount } = this.props;
        if (defaultPoints) {
            return remainingWorkPoints;
        } else {
            return remainingWorkCount;
        }
    }

    getDefaultRemainingTxt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Points';
        } else {
            return 'Pullrequests';
        }
    }
    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'PRs';
        }
    }

    render() {
        const { defaultPoints, remainingWorkRepos  } = this.props;

        return (
            <CustomCard
                headerTitle="Remaining work distribution"
                headerFactTitle={"Remaining " + this.getDefaultRemainingTxt()}
                headerFactValue={this.getDefaultRemaining() + " " + this.getDefaultRemainingTxtShrt()}
            >
                <ReposTreemap repos={remainingWorkRepos} defaultPoints={defaultPoints}/>
            </CustomCard>
        );
    }
}

RemainingWork.propTypes = {
    remainingWorkRepos: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    remainingWorkPoints: PropTypes.number.isRequired,
    remainingWorkCount: PropTypes.number.isRequired,
};

export default RemainingWork;
