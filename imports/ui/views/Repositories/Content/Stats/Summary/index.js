import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';

import CustomCard from "../../../../../components/CustomCard/index.js";
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import Moment from 'react-moment';
import {reactLocalStorage} from "reactjs-localstorage";

class Summary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { repositories, repositoriesTotalCount, repositoriesFirstUpdate, repositoriesLastUpdate, repositoriesTotalGitHubCount } = this.props;
        const lastFetchDate = reactLocalStorage.get('GitHubFetchIssues', null);
        if (repositories.length > 0) {
            const stats = [{
                name: 'Your Query',
                color: '#2196f3',
                repositoriesCount: repositories.length
            }, {
                name: 'Other Repos',
                color: '#e0e0e0',
                repositoriesCount: repositoriesTotalCount-repositories.length
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
                                    {repositoriesFirstUpdate.updatedAt !== undefined &&
                                    <div>
                                        First: <Moment format="ddd MMM. D, YYYY">{repositoriesFirstUpdate.updatedAt}</Moment>
                                    </div>
                                    }
                                    {repositoriesLastUpdate.updatedAt !== undefined &&
                                    <div>
                                        Last: <Moment format="ddd MMM. D, YYYY">{repositoriesLastUpdate.updatedAt}</Moment>
                                    </div>
                                    }
                                    <br />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <div><b>Source Data</b> <i>(GitHub)</i>:</div>
                                    <div>
                                        Total repositories fetched: {repositoriesTotalCount}
                                    </div>
                                    <div>
                                        Last data fetch:<br /> {lastFetchDate === null ? (<React.Fragment>n/a</React.Fragment>) : (<Moment format="ddd MMM. D, YYYY \a\t h:mm a">{lastFetchDate}</Moment>)}
                                    </div>
                                    <div>
                                        Total repositories in GitHub: {repositoriesTotalGitHubCount}
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <RepositoriesPie
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
    repositories: PropTypes.array.isRequired,
    repositoriesTotalCount: PropTypes.number.isRequired,
    repositoriesFirstUpdate: PropTypes.object,
    repositoriesLastUpdate: PropTypes.object,
    repositoriesTotalGitHubCount: PropTypes.number.isRequired,
};

const mapState = state => ({
    repositories: state.repositoriesView.repositories,
    repositoriesTotalCount: state.repositoriesView.repositoriesTotalCount,
    repositoriesFirstUpdate: state.repositoriesView.repositoriesFirstUpdate,
    repositoriesLastUpdate: state.repositoriesView.repositoriesLastUpdate,
    repositoriesTotalGitHubCount: state.repositoriesView.repositoriesTotalGitHubCount,
});

export default connect(mapState, null)(Summary);
