import React, { Component } from 'react';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";
import ColumnsTable from './ColumnsTable.js';

class Columns extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { columns } = this.props;
        return (
            <CustomCard
                headerTitle="Columns"
                headerFactTitle="Count"
                headerFactValue={columns.length}
            >
                <ColumnsTable columns={columns} />
            </CustomCard>
        );
    }
}

Columns.propTypes = {
    columns: PropTypes.array.isRequired,
};

const mapState = state => ({
    columns: state.projectView.columns,
});

export default connect(mapState, null)(Columns);
