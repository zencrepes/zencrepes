import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import IssuesTable from "../../../components/IssuesTable/index.js";
import CustomCard from "../../../components/CustomCard/index.js";

const styles = theme => ({
    root: {
    }
});

class Issues extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, issues } = this.props;

        return (
            <CustomCard
                headerTitle="Issues"
                headerFactTitle="Issues in Sprint"
                headerFactValue={issues.length}
            >
                <IssuesTable filteredIssues={issues} />
            </CustomCard>
        );
    }
}

Issues.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    issues: state.sprintsView.issues,
});

export default connect(mapState, null)(withStyles(styles)(Issues));
