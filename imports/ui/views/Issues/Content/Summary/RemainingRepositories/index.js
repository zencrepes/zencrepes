import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from "../../../../../components/CustomCard/index.js";

import IssuesTree from "../../../../../components/Charts/Nivo/IssuesTree.js";
import {connect} from "react-redux";

class RemainingWork extends Component {
    constructor (props) {
        super(props);
    }

    getDefaultRemaining() {
        const { defaultPoints, remainingWorkRepos } = this.props;
        if (defaultPoints) {
            return remainingWorkRepos.map(r => r.points).reduce((acc, points) => acc + points, 0);
        } else {
            return remainingWorkRepos.map(r => r.issues.length).reduce((acc, count) => acc + count, 0);
        }
    }

    getDefaultRemainingTxt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Points';
        } else {
            return 'Issues';
        }
    }
    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'Tkts';
        }
    }

    render() {
        const { defaultPoints, remainingWorkRepos  } = this.props;

        return (
            <CustomCard
                headerTitle="Remaining by Repository"
                headerFactTitle={"Remaining " + this.getDefaultRemainingTxt()}
                headerFactValue={this.getDefaultRemaining() + " " + this.getDefaultRemainingTxtShrt()}
            >
                <IssuesTree
                    dataset={remainingWorkRepos}
                    defaultPoints={defaultPoints}
                    emptyName="Repositories"
                />
            </CustomCard>
        );
    }
}

RemainingWork.propTypes = {
    defaultPoints: PropTypes.bool.isRequired,
    remainingWorkRepos: PropTypes.array.isRequired,
};

const mapState = state => ({
    defaultPoints: state.issuesView.defaultPoints,
    remainingWorkRepos: state.issuesView.remainingWorkRepos,
});

export default connect(mapState, null)(RemainingWork);
