import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import ToolboxIcon from "mdi-react/ToolboxIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { connect } from "react-redux";
import { CSVDownload } from "react-csv";

const styles = theme => ({
  root: {},
  button: {
    color: "#fff"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});
class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      clicked: false
    };
  }

  exportRepos = () => {
    this.setState({ anchorEl: null, clicked: !this.state.clicked });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  //https://stackoverflow.com/questions/5435228/sort-an-array-with-arrays-in-it-by-string
  comparator = (a, b) => {
    if (String(a[0]).toLowerCase() < String(b[0]).toLowerCase()) return -1;
    if (String(a[0]).toLowerCase() > String(b[0]).toLowerCase()) return 1;
    return 0;
  };

  formatData = repositories => {
    let header = [
      "repo",
      "isPrivate",
      "isArchived",
      "isFork",
      "url",
      "commit_master_date",
      "commit_master_author",
      "createdAt",
      "pushedAt",
      "updatedAt"
    ];
    let dataset = [];
    repositories.forEach(repo => {
      let latestCommitDate = null;
      let latestCommitAuthor = null;
      if (repo.refs.edges.length > 0) {
        latestCommitAuthor =
          repo.refs.edges[0].node.target.author.user === null ||
          repo.refs.edges[0].node.target.author.user.name === null
            ? repo.refs.edges[0].node.target.author.email
            : repo.refs.edges[0].node.target.author.user.name;
        latestCommitDate = repo.refs.edges[0].node.target.pushedDate;
      }
      dataset.push([
        repo.name,
        repo.isPrivate,
        repo.isArchived,
        repo.isFork,
        repo.url,
        latestCommitDate,
        latestCommitAuthor,
        repo.createdAt,
        repo.pushedAt,
        repo.updatedAt
      ]);
    });
    dataset = dataset.sort(this.comparator);
    dataset.unshift(header);
    return dataset;
  };

  render() {
    const { classes, repositories } = this.props;
    const { anchorEl, clicked } = this.state;

    if (repositories.length > 0) {
      return (
        <div className={classes.root}>
          <Tooltip title="Tools">
            <IconButton
              aria-label="Open"
              onClick={this.handleClick}
              className={classes.button}
            >
              <ToolboxIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.exportRepos}>Export to TSV</MenuItem>
          </Menu>
          {clicked && (
            <CSVDownload data={this.formatData(repositories)} target="_blank" />
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

Tools.propTypes = {
  classes: PropTypes.object.isRequired,
  setShowImportIssues: PropTypes.func.isRequired,
  repositories: PropTypes.array.isRequired
};

const mapState = state => ({
  repositories: state.repositoriesView.repositories
});

const mapDispatch = dispatch => ({
  setShowImportIssues: dispatch.issuesCreate.setShowImportIssues
});

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(Tools));
