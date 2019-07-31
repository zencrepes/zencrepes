import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Chart from "chart.js";

import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

const style = {
    root: {
        height: '200px',
    },
};


class IssuesPie extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.chart = {};
    }

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    buildChart = () => {
        const { dataset } = this.props;
        const myChartRef = this.chartRef.current.getContext("2d");

        const data = {
            datasets: [{
                label: "Repositories",
                data: dataset.map((cat) => {
                    let repositoriesCount = 0;
                    if (cat.repositories !== undefined) {repositoriesCount = cat.repositories.length;}
                    else {repositoriesCount = cat.repositoriesCount;}
                    return repositoriesCount;
                }),
                backgroundColor: dataset.map(cat => cat.color),
                repositories: dataset.map(cat => cat.repositories),
            }],
            labels: dataset.map(cat => cat.name),
        };

        this.chart = new Chart(myChartRef, {
            type: "pie",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                events: ['click'],
                onClick: this.clickSlice,
                legend: {
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        generateLabels: this.generateLabels,
                        usePointStyle: true,
                    }
                },
                tooltips: {
                    enabled: true,
                }
            }
        });
    };

    //https://jsfiddle.net/u1szh96g/208/
    clickSlice = (event) => {
        const activePoints = this.chart.getElementsAtEvent(event);
        if (activePoints[0] !== undefined) {
            const chartData = activePoints[0]['_chart'].config.data;
            const idx = activePoints[0]['_index'];
            const repositories = chartData.datasets[0].repositories[idx];
            if (repositories.length > 0) {
                const repositoriesArrayQuery = repositories.map(issue => issue.id);
                const query = {'id': {'$in': repositoriesArrayQuery}};
                this.props.history.push({
                    pathname: '/repositories',
                    search: '?q=' + encodeURIComponent(JSON.stringify(query)),
                    state: { detail: query }
                });
            }
        }
    };

    generateLabels = (chart) => {
        //https://jsfiddle.net/lcustodio/97pLd0um/1/
        chart.legend.afterFit = function () {
            this.lineWidths = this.lineWidths.map( () => this.width-12 );
            this.options.labels.padding = 10;
            this.options.labels.boxWidth = 15;
        };
        //https://stackoverflow.com/questions/39454586/pie-chart-legend-chart-js
        const data = chart.data;
        if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
                var meta = chart.getDatasetMeta(0);
                var ds = data.datasets[0];
                var arc = meta.data[i];
                var custom = arc && arc.custom || {};
                var getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
                var arcOpts = chart.options.elements.arc;
                var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                var value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];
                return {
                    text: label + " (" + value + ")",
                    fillStyle: fill,
                    strokeStyle: stroke,
                    lineWidth: bw,
                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                    index: i
                }
            });
        } else {
            return [];
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        );
    }
}

IssuesPie.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    dataset: PropTypes.array,
};

export default withRouter(withStyles(style)(IssuesPie));
