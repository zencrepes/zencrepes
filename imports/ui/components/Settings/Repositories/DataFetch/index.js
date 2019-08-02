import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Input from "@material-ui/core/Input";

import { reactLocalStorage } from "reactjs-localstorage";

const styles = {
  root: {
    margin: "10px",
    width: "100%"
  },
  card: {
    height: "300px",
    overflow: "auto"
  },
  cardHistory: {
    overflow: "auto"
  },
  title: {
    fontSize: 14
  },
  details: {
    fontSize: 12
  },
  cardContent: {
    paddingBottom: "0px"
  },
  input: {
    marginLeft: "5px",
    width: "30px"
  }
};

class DataFetch extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Card className={classes.cardHistory}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Data Fetch
            </Typography>
            <div className={classes.details} color="textPrimary">
              Fetch
              <Input
                defaultValue={reactLocalStorage.get("dataFetchNodes", 30)}
                className={classes.input}
                inputProps={{
                  "aria-label": "Description"
                }}
                onChange={event => {
                  let nodesFetch = parseInt(event.target.value);
                  if (isNaN(nodesFetch)) {
                    nodesFetch = 100;
                  } else if (nodesFetch > 100) {
                    nodesFetch = 100;
                  } else if (nodesFetch < 1) {
                    nodesFetch = 5;
                  }
                  reactLocalStorage.set("dataFetchNodes", nodesFetch);
                }}
              />
              nodes at a time through GitHub GraphQL API (max: 100).
              <br />
              <i>
                The number of nodes to load at a time is dependent upon your
                repository size. Best to go with a smaller number (~30) if
                fetching very large repositories.
              </i>
              <br />
              <br />
              For first issues load, only load issues updated in the past
              <Input
                defaultValue={reactLocalStorage.get("issuesHistoryLoad", 3)}
                className={classes.input}
                inputProps={{
                  "aria-label": "Description"
                }}
                onChange={event => {
                  reactLocalStorage.set(
                    "issuesHistoryLoad",
                    parseInt(event.target.value)
                  );
                }}
              />{" "}
              Months.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

DataFetch.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(DataFetch);
