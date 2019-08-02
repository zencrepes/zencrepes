import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";

const styles = {
  root: {},
  subtitle: {
    fontSize: "20px",
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: 1.5
  },
  paragraph: {
    color: "#898989",
    lineHeight: 1.75,
    fontSize: "16px",
    margin: "0 0 10px",
    fontFamily: "Roboto",
    fontWeight: 400
  }
};

class Step1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <p className={classes.subtitle}>Select your repositories</p>
        <p className={classes.paragraph}>
          This configuration wizard will offer you to select repositories to
          load data from. ZenCrepes will then load data from GitHub to your
          local browser.
        </p>
        <p className={classes.subtitle}>Add external orgs and repos</p>
        <p className={classes.paragraph}>
          You can also load data from public organizations and repositories. You
          can track dependencies with external projects, or simply explore
          another team&apos;s content, All of this in read-only mode. For
          example try adding the &quot;microsoft&quot; organization with the
          &quot;cntk&quot; repository.
        </p>
        <p className={classes.subtitle}>
          Watch-out for GitHub API resources limits
        </p>
        <p className={classes.paragraph}>
          GitHub has{" "}
          <a href="https://developer.github.com/v4/guides/resource-limitations/">
            API resources limits
          </a>
          , based on the complexity of the query. You get 5000 points per 1 hour
          window, ZenCrepes displays your current points quota at the bottom of
          the page.
        </p>
      </React.Fragment>
    );
  }
}

Step1.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Step1);
