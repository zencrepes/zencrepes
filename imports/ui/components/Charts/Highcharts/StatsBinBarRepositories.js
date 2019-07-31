import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {withRouter} from "react-router-dom";

class StatsBinBar extends Component {
    constructor(props) {
        super(props);
    }

    clickBar = (event) => {
        if (event.point.repositories !== undefined && event.point.repositories.length > 0) {
            const repositories = event.point.repositories;
            const repositoriesArrayQuery = repositories.map(repository => repository.id);
            const query = {'id': {'$in': repositoriesArrayQuery}};
            this.props.history.push({
                pathname: '/repositories',
                search: '?q=' + encodeURIComponent(JSON.stringify(query)),
                state: { detail: query }
            });
        }
    };


    render() {
        const { dataset } = this.props;
        let updatedOptions = {
            chart: {
                height: 200,
                type: 'column',
            },
            title: null,
            xAxis: {
                categories: dataset.map(cat => cat.label),
            },
            yAxis: {
                min: 0,
                title: 'Repositories count'
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                },
                series: {
                    pointPadding: 0,
                    groupPadding: 0,
                    events: {
                        click: this.clickBar
                    }
                }
            },
            series: [{
                name: 'Repositories',
                showInLegend: false,
                data: dataset.map((cat) => {
                    return {
                        y: cat.repositories.length,
                        repositories: cat.repositories,
                    };
                })
            }],
            credits: {
                enabled: false
            }
        };

        return (
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'chart'}
                options={updatedOptions}
            />
        );
    }
}

StatsBinBar.propTypes = {
    dataset: PropTypes.array,
    history: PropTypes.object.isRequired,
};

export default withRouter(StatsBinBar);
