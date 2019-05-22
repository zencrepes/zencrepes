import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import DatabaseImportIcon from 'mdi-react/DatabaseImportIcon';
import Tooltip from '@material-ui/core/Tooltip';

import {connect} from "react-redux";


const styles = theme => ({
    root: {
    },
    button: {
        color: '#fff',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class Import extends Component {
    constructor (props) {
        super(props);
    }

    importIssues = () => {
        const { setShowImportIssues } = this.props;
        setShowImportIssues(true);
    };

    render() {
        const { classes, issues } = this.props;

        if (issues.length > 0) {
            return (
                <div className={classes.root}>
                    <Tooltip title="Import issues from TSV">
                        <IconButton aria-label="Import" onClick={this.importIssues} className={classes.button}>
                            <DatabaseImportIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )

        } else {
            return null;
        }
    }
}

Import.propTypes = {
    classes: PropTypes.object.isRequired,
    setShowImportIssues: PropTypes.func.isRequired,
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
});

const mapDispatch = dispatch => ({
    setShowImportIssues: dispatch.issuesCreate.setShowImportIssues,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Import));
