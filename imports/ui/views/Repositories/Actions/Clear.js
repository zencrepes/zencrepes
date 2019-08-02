import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import BroomIcon from "mdi-react/BroomIcon";
import Tooltip from "@material-ui/core/Tooltip";

import { connect } from "react-redux";

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
class Clear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  purgeLocal = () => {
    const { clearRepositories } = this.props;
    clearRepositories();
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, repositories } = this.props;
    const { anchorEl } = this.state;

    if (repositories.length > 0) {
      return (
        <div className={classes.root}>
          <Tooltip title="Clear repositories from your browser">
            <IconButton
              aria-label="Open"
              onClick={this.handleClick}
              className={classes.button}
            >
              <BroomIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.purgeLocal}>
              Clear local repositories
            </MenuItem>
          </Menu>
        </div>
      );
    } else {
      return null;
    }
  }
}

Clear.propTypes = {
  classes: PropTypes.object.isRequired,
  clearRepositories: PropTypes.func.isRequired,
  repositories: PropTypes.array.isRequired
};

const mapState = state => ({
  repositories: state.repositoriesView.repositories
});

const mapDispatch = dispatch => ({
  clearRepositories: dispatch.repositoriesView.clearRepositories
});

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(Clear));
