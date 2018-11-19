import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Search from "./Search";
import Table from "@material-ui/core/Table/Table";
import Grid from "@material-ui/core/Grid/Grid";
import IssuesFacets from "../../../../Facets";

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class Header extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, filteredIssues } = this.props;
        return (
            <TableHead>
                <TableRow>
                    <TableCell>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item >
                                <span>{filteredIssues.length} Issues</span>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Search />
                            </Grid>
                        </Grid>
                    </TableCell>
                </TableRow>
            </TableHead>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Header);
