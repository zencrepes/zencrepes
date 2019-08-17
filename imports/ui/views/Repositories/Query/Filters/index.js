import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Aggregation from "./Aggregation.js";
import FiltersDate from "./FiltersDate.js";

const styles = {
  root: {
    margin: "10px"
  },
  query: {
    flex: 1
  }
};

class Filters extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * getActiveFacets() parse query and returns facets contained in that query
   */
  getActiveFacets = (query, facets) => {
    return facets
      .filter(facet => {
        if (facet.nested === false) {
          if (query[facet.key] !== undefined) {
            return true;
          }
        } else {
          if (query[facet.key + ".edges"] !== undefined) {
            let nestedKey = "node." + facet.nestedKey;
            if (
              query[facet.key + ".edges"]["$elemMatch"][nestedKey] !== undefined
            ) {
              return true;
            }
          }
        }
        return false;
      })
      .map(facet => {
        if (facet.nested === false) {
          return { ...facet, values: query[facet.key]["$in"] };
        } else {
          return {
            ...facet,
            values:
              query[facet.key + ".edges"]["$elemMatch"][
                "node." + facet.nestedKey
              ]["$in"]
          };
        }
      });
  };

  render() {
    const {
      classes,
      query,
      facets,
      timeFields,
      updateQuery,
      updateQueryDate
    } = this.props;
    const activeFacets = this.getActiveFacets(query, facets);
    const activeDateFields = timeFields.filter(
      field => query[field.idx] !== undefined
    );
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={0}
        >
          {activeFacets.map(facet => (
            <Grid item key={facet.name}>
              <Aggregation
                query={query}
                facets={activeFacets}
                currentFacet={facet}
                updateQuery={updateQuery}
              />
            </Grid>
          ))}
          {activeDateFields.map(datefilter => (
            <Grid item key={datefilter.idx}>
              <FiltersDate
                query={query}
                datefilter={datefilter}
                updateQueryDate={updateQueryDate}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

Filters.propTypes = {
  classes: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  facets: PropTypes.array.isRequired,
  timeFields: PropTypes.array.isRequired,
  updateQuery: PropTypes.func,
  updateQueryDate: PropTypes.func
};

export default withStyles(styles)(Filters);
