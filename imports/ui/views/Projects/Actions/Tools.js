import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import ToolboxIcon from "mdi-react/ToolboxIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  copyProjectCards = () => {
    const { setShowCopyCards } = this.props;
    setShowCopyCards(true);
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, projects } = this.props;
    const { anchorEl } = this.state;

    if (projects.length > 0) {
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
            <MenuItem onClick={this.copyProjectCards}>
              Copy cards between Projects
            </MenuItem>
          </Menu>
        </div>
      );
    } else {
      return null;
    }
  }
}

Tools.propTypes = {
  classes: PropTypes.object.isRequired,
  setShowCopyCards: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired
};

const mapState = state => ({
  projects: state.projectsView.projects
});

const mapDispatch = dispatch => ({
  setShowCopyCards: dispatch.cardsCreate.setShowCopyCards
});

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(Tools));
