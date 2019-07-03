import React, { Component } from "react";

import PropTypes from "prop-types";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 350
  }
});

class SelectProjectDropdown extends Component {
  constructor(props) {
    super(props);
  }

  selectProject = event => {
    const { updateSelectedProject } = this.props;
    updateSelectedProject(event.target.value);
  };

  render() {
    const { classes, projects, selectedProject, type } = this.props;
    return (
      <TextField
        id={"select-" + type + "-project"}
        select
        label={"Select " + type + " project"}
        className={classes.textField}
        value={selectedProject.id}
        onChange={this.selectProject}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
        margin="normal"
      >
        <MenuItem key={"none"} value={"none"}>
          No project selected
        </MenuItem>
        {projects.map(project => {
          return (
            <MenuItem key={project.id} value={project.id}>
              {project.repo === null ? (
                <React.Fragment>
                  {project.org.login} - {project.name}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {project.org.login}/{project.repo.name} - {project.name}
                </React.Fragment>
              )}
            </MenuItem>
          );
        })}
      </TextField>
    );
  }
}

SelectProjectDropdown.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
  selectedProject: PropTypes.object.isRequired,
  updateSelectedProject: PropTypes.func.isRequired
};

export default withStyles(styles)(SelectProjectDropdown);
