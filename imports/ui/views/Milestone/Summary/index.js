import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactMarkdown from 'react-markdown';

import CustomCard from "../../../components/CustomCard/index.js";
import EditButton from './EditButton.js';

class Summary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            selectedMilestoneDescription,
            selectedMilestoneTitle,
            selectedMilestoneDueDate,
            milestones
        } = this.props;

        let dueDate = 'Not Set';
        if (selectedMilestoneDueDate !== null) {
            var moment = require('moment');
            dueDate = moment(selectedMilestoneDueDate).utc().format('ddd MMM D, YYYY');
        }
        
        // More on moment/time:
        // https://maggiepint.com/2016/05/14/moment-js-shows-the-wrong-date/
        // https://momentjs.com/docs/#/parsing/string-format/

        // headerFactValue={<Moment format="ddd MMM D, YYYY" tz="America/Los_Angeles">{selectedSprintDueDate}</Moment> }
        return (
            <CustomCard
                headerTitle={selectedMilestoneTitle}
                headerIcon={<EditButton milestones={milestones}/>}
                headerFactTitle="Due date"
                headerFactValue={dueDate}
            >
                <ReactMarkdown source={selectedMilestoneDescription} />
            </CustomCard>
        );
    }
}

Summary.propTypes = {
    selectedMilestoneDescription: PropTypes.string,
    selectedMilestoneTitle: PropTypes.string,
    selectedMilestoneDueDate: PropTypes.string,
    milestones: PropTypes.array.isRequired,
};


const mapState = state => ({
    selectedMilestoneDescription: state.milestoneView.selectedMilestoneDescription,
    selectedMilestoneTitle: state.milestoneView.selectedMilestoneTitle,
    selectedMilestoneDueDate: state.milestoneView.selectedMilestoneDueDate,

    milestones: state.milestoneView.milestones,
});

export default connect(mapState, null)(Summary);
