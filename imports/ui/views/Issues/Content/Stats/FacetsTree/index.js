import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import MsTreemap from './MsTreemap.js';
import {connect} from "react-redux";

class FacetsTree extends Component {
    constructor(props) {
        super(props);
    }

    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'Tkts';
        }
    }

    render() {
        const { facets, setUpdateQueryPath, setUpdateQuery, facetKey, query, defaultPoints } = this.props;
        const facet = _.find(facets, (facet) => {return facet.key === facetKey});

        let selectedValues = [];
        let selfacetKey = facetKey;
        if (facet.nested === true) {
            selfacetKey = selfacetKey + '.edges';
        }
        if (query[selfacetKey] !== undefined) {
            if (facet.nested === false) {
                selectedValues = query[selfacetKey]['$in'];
            } else {
                let nestedKey = 'node.' + facet.nestedKey;
                selectedValues = query[selfacetKey]['$elemMatch'][nestedKey]['$in'];
            }
        }
        let dataset = facet.values;
        if (selectedValues.length > 0) {
            dataset = facet.values.filter((value) => selectedValues.indexOf(value.name) > -1);
        }

        if (facet !== undefined) {
            return (
                <CustomCard
                    headerTitle={facet.name}
                    headerFactTitle={this.getDefaultRemainingTxtShrt()}
                    headerFactValue=""
                    headerLegend="This chart is automatically built from facets data on the left panel"
                >
                    {facet.values.length > 0 ? (
                        <MsTreemap
                            dataset={dataset}
                            facetName={facet.name}
                            setUpdateQueryPath={setUpdateQueryPath}
                            setUpdateQuery={setUpdateQuery}
                            defaultPoints={defaultPoints}
                        />
                    ): (
                        <span>No data available</span>
                    )}

                </CustomCard>
            );
        } else {
            return null;
        }
    }
}

FacetsTree.propTypes = {
    facets: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    facetKey: PropTypes.string.isRequired,
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    facets: state.issuesView.facets,
    query: state.issuesView.query,
    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(FacetsTree);
