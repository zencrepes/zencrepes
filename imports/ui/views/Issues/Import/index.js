import React, { Component } from 'react';
import {withSnackbar} from "notistack";

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';

import Files from 'react-files';
import Papa from 'papaparse';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

class ImportIssues extends Component {
    constructor (props) {
        super(props);
        //https://stackoverflow.com/questions/49776193/react-open-json-file-via-dialog-and-read-content
        //https://www.npmjs.com/package/papaparse
    }

    close = () => {
        const { setShowImportIssues } = this.props;
        setShowImportIssues(false);
    };

    onFilesChange = (files) => {
        const { loadTsv } = this.props;
        if (files.length === 1) {
            Papa.parse(files[0], {
                delimiter: '\t',
                newline: '',
                header: true,
                complete: loadTsv
            });
        }
    };

    onFilesError = (error) => {
        const { enqueueSnackbar } = this.props;
        enqueueSnackbar(error.message, {
            variant: 'warning',
            persist: true,
        });
    };

    render() {
        const { showImportIssues, classes } = this.props;
        if (showImportIssues) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={showImportIssues} maxWidth="md">
                    <DialogTitle id="simple-dialog-title">Create Issues from TSV</DialogTitle>
                    <DialogContent>
                        <span>This features creates issues in bulk from a TSV file. During the import process, ZenCrepes will verify labels, milestones, assignees and repositories, please ensure to have those loaded in the tool. You can start by populating a <a href="/github-blank-tsv-issue-import.tsv" target="_blank">a TSV Template</a> with your favorite editor (or Google Spreadsheet), do not delete the first line (header).  You will get to verify the change before submission to GitHub.</span>
                        <br /><br /><span><u><b>TSV columns</b></u></span>
                        <br /><u><b>org</b></u>: GitHub org to push the issue to
                        <br /><u><b>repo</b></u>: GitHub repo to push the issue to
                        <br /><u><b>duplicate</b></u>: Duplicate an issue from the same repository, format is: #ISSUE_NUMBER. If some other fields (such as title, body, assignees, labels, or milestone) are populated, they will be replaced in the issue. You can clear some fields by indicating null as their value. For example, importing issue X, but indicating null in the body column will duplicate the issue but leave the body empty.
                        <br /><u><b>title</b></u>: Title of the issue
                        <br /><u><b>body</b></u>: Body of the issue
                        <br /><u><b>assignees</b></u>: Comma separated list of assignees
                        <br /><u><b>labels</b></u>: Comma separated list of lables
                        <br /><u><b>milestone</b></u>: Milestone title
                        <br /><br />
                        <Files
                            className='files-dropzone'
                            onChange={this.onFilesChange}
                            onError={this.onFilesError}
                            accepts={['.tsv']}
                            multiple={false}
                            maxFiles={1}
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable
                        >
                            <Button variant="contained" component="span" className={classes.button}>
                                Open TSV
                            </Button>
                        </Files>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.close} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return null;
        }
    }
}

ImportIssues.propTypes = {
    classes: PropTypes.object.isRequired,
    showImportIssues: PropTypes.bool.isRequired,
    setShowImportIssues: PropTypes.func.isRequired,
    loadTsv: PropTypes.func.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,

};

const mapState = state => ({
    showImportIssues: state.issuesCreate.showImportIssues,
});

const mapDispatch = dispatch => ({
    setShowImportIssues: dispatch.issuesCreate.setShowImportIssues,
    loadTsv: dispatch.issuesCreate.loadTsv,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(withSnackbar(ImportIssues)));
