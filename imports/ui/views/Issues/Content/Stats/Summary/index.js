import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';

import CustomCard from "../../../../../components/CustomCard/index.js";
//import PieChart from '../../../../../components/Charts/PieChart.js';
import IssuesPie from '../../../../../components/Charts/ChartJS/IssuesPie.js';


import Moment from 'react-moment';
import {reactLocalStorage} from "reactjs-localstorage";

class Summary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { issues, issuesTotalCount, issuesFirstUpdate, issuesLastUpdate, issuesTotalGitHubCount } = this.props;
        const lastFetchDate = reactLocalStorage.get('GitHubFetchIssues', null);
        if (issues.length > 0) {
            const stats = [{
                name: 'Your Query',
                color: '#2196f3',
                issuesCount: issues.length
            }, {
                name: 'Other Issues',
                color: '#e0e0e0',
                issuesCount: issuesTotalCount-issues.length
            }];
            return (
                <CustomCard
                    headerTitle="Summary"
                    headerFactTitle=""
                    headerFactValue=""
                >
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={6} sm={6} md={6}>
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                                spacing={16}
                            >
                                <Grid item xs={12} sm={12} md={12}>
                                    <div><b>Query data</b> <i>(updatedAt)</i>:</div>
                                    {issuesFirstUpdate.updatedAt !== undefined &&
                                    <div>
                                        First: <Moment format="ddd MMM. D, YYYY">{issuesFirstUpdate.updatedAt}</Moment>
                                    </div>
                                    }
                                    {issuesLastUpdate.updatedAt !== undefined &&
                                    <div>
                                        Last: <Moment format="ddd MMM. D, YYYY">{issuesLastUpdate.updatedAt}</Moment>
                                    </div>
                                    }
                                    <br />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <div><b>Source Data</b> <i>(GitHub)</i>:</div>
                                    <div>
                                        Total issues fetched: {issuesTotalCount}
                                    </div>
                                    <div>
                                        Last data fetch:<br /> {lastFetchDate === null ? (<React.Fragment>n/a</React.Fragment>) : (<Moment format="ddd MMM. D, YYYY \a\t h:mm a">{lastFetchDate}</Moment>)}
                                    </div>
                                    <div>
                                        Total issues in GitHub: {issuesTotalGitHubCount}
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <IssuesPie
                                dataset={stats}
                            />
                        </Grid>
                    </Grid>
                </CustomCard>
            );
        } else {
            return null
        }
    }
}

Summary.propTypes = {
    issues: PropTypes.array.isRequired,
    issuesTotalCount: PropTypes.number.isRequired,
    issuesFirstUpdate: PropTypes.object,
    issuesLastUpdate: PropTypes.object,
    issuesTotalGitHubCount: PropTypes.number.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
    issuesTotalCount: state.issuesView.issuesTotalCount,
    issuesFirstUpdate: state.issuesView.issuesFirstUpdate,
    issuesLastUpdate: state.issuesView.issuesLastUpdate,
    issuesTotalGitHubCount: state.issuesView.issuesTotalGitHubCount,
});

export default connect(mapState, null)(Summary);
