import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import {
    // State or Local Processing Plugins
    SelectionState,
    PagingState,
    IntegratedSelection,
    IntegratedPaging,
    DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    ColumnChooser,
    TableColumnVisibility,
    TableSelection,
    Toolbar,
} from '@devexpress/dx-react-grid-material-ui';

const styles = theme => ({
    root: {
        height: '150px'
    },

});

class SelectedDescriptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'count', title: 'Occurences'},
                { name: 'value', title: 'Value'},
            ],
            tableColumnExtensions: [
                { columnName: 'count', width: 100 },
            ],
        };
    }

    buildDataset() {
        const { selectedRepos } = this.props;
        let descriptionsElements = _.groupBy(selectedRepos, 'label.description');
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
        const { classes } = this.props;
        const { columns, tableColumnExtensions} = this.state;

        console.log(this.buildDataset());
        return (
            <div className={classes.root}>
                <Grid
                    rows={this.buildDataset()}
                    columns={columns}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
            </div>
        );
    }
}

SelectedDescriptions.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    selectedRepos: state.labelsconfiguration.selectedRepos,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(SelectedDescriptions));