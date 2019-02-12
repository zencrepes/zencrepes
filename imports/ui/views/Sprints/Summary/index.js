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
            selectedSprintDescription,
            selectedSprintTitle,
            selectedSprintDueDate,
            milestones
        } = this.props;

        let dueDate = 'Not Set';
        if (selectedSprintDueDate !== null) {
            var moment = require('moment');
            dueDate = moment(selectedSprintDueDate).utc().format('ddd MMM D, YYYY');
        }
        
        // More on moment/time:
        // https://maggiepint.com/2016/05/14/moment-js-shows-the-wrong-date/
        // https://momentjs.com/docs/#/parsing/string-format/

        // headerFactValue={<Moment format="ddd MMM D, YYYY" tz="America/Los_Angeles">{selectedSprintDueDate}</Moment> }
        return (
            <CustomCard
                headerTitle={selectedSprintTitle}
                headerIcon={<EditButton milestones={milestones}/>}
                headerFactTitle="Due date"
                headerFactValue={dueDate}
            >
                <ReactMarkdown source={selectedSprintDescription} />
            </CustomCard>
        );
    }
}

Summary.propTypes = {
    selectedSprintDescription: PropTypes.string,
    selectedSprintTitle: PropTypes.string,
    selectedSprintDueDate: PropTypes.string,
    milestones: PropTypes.array.isRequired,
};


const mapState = state => ({
    selectedSprintDescription: state.sprintsView.selectedSprintDescription,
    selectedSprintTitle: state.sprintsView.selectedSprintTitle,
    selectedSprintDueDate: state.sprintsView.selectedSprintDueDate,

    milestones: state.sprintsView.milestones,
});

export default connect(mapState, null)(Summary);
