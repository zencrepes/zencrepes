import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import CustomCard from "../../../../components/CustomCard";

class SelectedDescriptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'count', title: 'Occurences'},
                { name: 'value', title: 'Description(s)'},
            ],
            tableColumnExtensions: [
                { columnName: 'count', width: 100 },
            ],
        };
    }

    buildDataset() {
        const { selectedLabels } = this.props;
        let descriptionsElements = _.groupBy(selectedLabels, 'description');
        let descriptions = Object.keys(descriptionsElements).map(idx => {
            return {
                items: descriptionsElements[idx],
                count: descriptionsElements[idx].length,
                value: idx,
            }
        });
        descriptions = _.sortBy(descriptions, [function(o) {return o.count;}]);
        descriptions = descriptions.reverse();
        return descriptions;
    }
    render() {
        const { columns, tableColumnExtensions} = this.state;

        return (
            <CustomCard
                headerTitle="Label Descriptions"
                headerFactTitle=""
                headerFactValue=""
            >
                <Grid
                    rows={this.buildDataset()}
                    columns={columns}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
            </CustomCard>
        );
    }
}

SelectedDescriptions.propTypes = {
    selectedLabels: PropTypes.array.isRequired,

};

const mapState = state => ({
    selectedLabels: state.labelsEdit.selectedLabels,

});

export default connect(mapState, null)(SelectedDescriptions);