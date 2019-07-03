import React, { Component } from "react";

import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";

class ColumnsTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { project } = this.props;
    if (project.id === "none") {
      return null;
    }
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="row">
              Column Name
            </TableCell>
            <TableCell component="th" scope="row">
              Cards
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {project.columns.edges.map(column => {
            return (
              <TableRow key={column.node.id}>
                <TableCell component="th" scope="row">
                  {column.node.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {column.node.cards.totalCount}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

ColumnsTable.propTypes = {
  project: PropTypes.object.isRequired
};

export default ColumnsTable;
