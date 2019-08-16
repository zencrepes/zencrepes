import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid/Grid";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import Chip from "@material-ui/core/Chip";

import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";

import Moment from "react-moment";

import { Label } from "@primer/components";
import fontColorContrast from "font-color-contrast";

import { withRouter } from "react-router-dom";

//https://forums.meteor.com/t/meteor-scss-react/41654/8
//https://styleguide.github.com/primer/components/avatars/
//import "primer-avatars";

const styles = theme => ({
  repoName: {
    color: "#586069!important",
    fontSize: "16px",
    marginRight: "5px",
    textDecoration: "none"
  },
  repositoryTitle: {
    fontSize: "16px",
    color: "#000000!important",
    textDecoration: "none"
  },
  authorLink: {
    textDecoration: "none",
    fontSize: "12px",
    color: "#586069!important"
  },
  repositorySubTitle: {
    textDecoration: "none",
    fontSize: "12px",
    color: "#586069!important"
  },
  avatar: {
    width: 35,
    height: 35
  },
  points: {
    width: 35,
    height: 35
  },
  chip: {
    marginRight: "5px",
    height: 25
  },
  iconOpen: {
    margin: theme.spacing.unit,
    fontSize: 20,
    color: red[800]
  },
  iconClosed: {
    margin: theme.spacing.unit,
    fontSize: 20,
    color: green[800]
  },
  iconSprint: {
    fontSize: 14,
    margin: 0
  },
  label: {
    marginRight: 5,
    marginTop: 10,
    padding: 5,
    border: "1px solid #eeeeee"
  },
  chipAgile: {
    margin: "4px",
    height: "15px"
  },
  link: {
    textDecoration: "none"
  }
});

class RepositoryWide extends Component {
  constructor(props) {
    super(props);
  }

  linkGraph = () => {
    const { repository } = this.props;
    const query = { id: { $in: [repository.id] } };
    this.props.history.push({
      pathname: "/repositorys/graph",
      search: "?q=" + encodeURIComponent(JSON.stringify(query)),
      state: { detail: query }
    });
  };

  render() {
    const { classes, repository } = this.props;
    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={8}
        >
          <Grid item xs={12} sm container>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              spacing={0}
            >
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={8}
                >
                  <Grid item>
                    <a
                      href={repository.url}
                      className={classes.repoName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repository.org.login}/{repository.name}
                    </a>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                {repository.languages.totalCount > 0 && (
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="flex-end"
                    spacing={0}
                  >
                    {//Filters out labels which are point since points are listed in the last column anyway
                    repository.languages.edges.map(language => {
                      return (
                        <Grid item key={language.node.name}>
                          <Label
                            size="small"
                            m={1}
                            style={{
                              background: "#" + language.node.color,
                              color: fontColorContrast(
                                "#" + language.node.color
                              )
                            }}
                          >
                            {language.node.name}
                          </Label>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={8}
                >
                  {repository.teams !== undefined &&
                    repository.teams.edges.map(team => {
                      return (
                        <Grid item key={team.node.name}>
                          <Chip
                            color="primary"
                            icon={<PeopleIcon />}
                            size="small"
                            label={
                              team.node.name + " (" + team.node.permission + ")"
                            }
                          />
                        </Grid>
                      );
                    })}
                  {repository.collaborators !== null &&
                    repository.collaborators.edges.map(col => {
                      return (
                        <Grid item key={col.node.login}>
                          <Chip
                            color="secondary"
                            icon={<PersonIcon />}
                            size="small"
                            label={col.node.login + " (" + col.permission + ")"}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </Grid>
              <Grid item className={classes.repositorySubTitle}>
                <span>
                  <a
                    href={repository.url}
                    className={classes.repositorySubTitle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    #{repository.number}
                  </a>{" "}
                </span>
                <span>
                  created on{" "}
                  <Moment format="ddd MMM D, YYYY">
                    {repository.createdAt}
                  </Moment>
                </span>
                <span>
                  , last update on{" "}
                  <Moment format="ddd MMM D, YYYY">
                    {repository.updatedAt}
                  </Moment>
                </span>
                <span>
                  , last push on{" "}
                  <Moment format="ddd MMM D, YYYY">
                    {repository.pushedAt}
                  </Moment>
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

RepositoryWide.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  repository: PropTypes.object
};

export default withRouter(withStyles(styles)(RepositoryWide));
// <span><DirectionsRunIcon className={classes.iconSprint} />{repository.milestone.title}</span>
// <span><ViewColumnIcon className={classes.iconSprint} />{repository.boardState.name}</span>
