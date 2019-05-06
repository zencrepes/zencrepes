import _ from 'lodash';
import React, { Component } from 'react';

import CustomCard from "../../../../../components/CustomCard/index.js";
import { cfgIssues } from '../../../../../data/Minimongo.js';

import PropTypes from "prop-types";
import {connect} from "react-redux";

import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
//import cytoscapeQtip from 'cytoscape-qtip';

import popper from 'cytoscape-popper';

import Tippy from 'tippy.js';
import 'tippy.js/themes/light-border.css';
import IssueCompact from '../../../../../components/Issue/IssueTooltip.js';
import ReactDOMServer from 'react-dom/server';

import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use(COSEBilkent);
Cytoscape.use(popper);

//Cytoscape.use(cytoscapeQtip);

class IssuesGraph extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.maxIssues = 400;
        this.tippyInstances = {};
        this.selectedTippies = {};
    }

    componentDidUpdate() {
        this.updateChart(this.chartRef);
    }

    componentDidMount() {
        this.updateChart(this.chartRef);
    }

    //https://github.com/cytoscape/cytoscape.js/blob/master/documentation/demos/tokyo-railways/tokyo-railways.js
    makeTippy = (node, text, nodeElement) => {
        return Tippy(node.popperRef(), {
            content: function () {
                var div = document.createElement('div');
                div.innerHTML = text;
                //return div;
                return ReactDOMServer.renderToString(<IssueCompact issue={nodeElement}/>);
            },
            trigger: 'manual',
            theme: 'light-border',
            arrow: true,
            placement: 'bottom',
            //hideOnClick: true,
            interactive: true,
            multiple: true,
            sticky: true
        });
    };

    // Clear all previous tippies
    clearTippies = () => {
        Object.values(this.tippyInstances).forEach((tippy) => {
            tippy.hide();
            tippy.destroy();
        });
        this.tippyInstances = {};
        this.selectedTippies = {};
    };

    updateChart = (cy) => {
        this.clearTippies();
        cy.elements().remove();
        cy.add(this.prepareDataset());

        /*
        cy.on("tap", "node", (event) => {
            const nodeId = event.target.id();
            console.log('tap - ' + nodeId);

            const dataNode = event.target.data();
            const node = event.target;
            console.log(node);
            console.log(node.popperRef());

            this.tippyInstances[nodeId] = this.makeTippy(node, dataNode.title, dataNode);
            this.tippyInstances[nodeId].show();
        });
        */

        cy.on("mouseover", "node", (event) => {
            const nodeId = event.target.id();
            const dataNode = event.target.data();
            const node = event.target;
            this.tippyInstances[nodeId] = this.makeTippy(node, dataNode.title, dataNode);
            this.tippyInstances[nodeId].show();
        });

/*
        cy.on("click", "node", (event) => {
            const nodeId = event.target.id();
            const node = event.target;
            console.log(node);
            // If tippy node doesn't exist, we create it.
            if (this.tippyInstances[nodeId] === undefined) {
                console.log('Tippy doesnt exist, creating');
                const dataNode = event.target.data();
                const node = event.target;
                this.tippyInstances[nodeId] = this.makeTippy(node, dataNode.title, dataNode);
            }
            if (this.selectedTippies[nodeId] === undefined) {
                console.log('Tippy show');
                console.log(this.tippyInstances[nodeId]);

//                this.selectedTippies[nodeId] = this.tippyInstances[nodeId];
                this.tippyInstances[nodeId].show();

            } else {
                console.log('Tippy hide');
                console.log(this.tippyInstances[nodeId]);

                this.tippyInstances[nodeId].hide();
//                delete(this.selectedTippies[nodeId]);
            }

            console.log(nodeId);
        });
*/


        cy.on("mouseout", "node", (event) => {
            const nodeId = event.target.id();
            //We only hide on mouseout for non-clicked nodes
            if (this.selectedTippies[nodeId] === undefined) {
                this.tippyInstances[nodeId].hide();
            }
        });

        let layout = cy.layout({
            name: 'cose-bilkent'
        });
        layout.run();
    };

    prepareDataset = () => {
        const { issues } = this.props;

        const filteredIssues = issues.filter(issue => (issue.linkedIssues.target.length > 0 || issue.linkedIssues.source.length > 0)).slice(0,this.maxIssues);
        const filteredIssuesIds = filteredIssues.map((issue) => {
            return {
                data: {
                    ...issue,
                    label: issue.title,
                }
            };

        });
        filteredIssues.forEach((issue) => {
            if (issue.linkedIssues.target.length > 0) {
                issue.linkedIssues.target.forEach((target) => {
                    if (_.findIndex(filteredIssuesIds, {id: target.id}) === -1) {
                        // Issue not found
                        let foundIssue = cfgIssues.findOne({id: target.id});
                        if (foundIssue === undefined) {
                            foundIssue = {...target, partial: true};
                        }
                        filteredIssuesIds.push({
                            data: {
                                ...foundIssue,
                                label: target.title,
                            }
                        });
                    }
                    filteredIssuesIds.push({
                        data: {target: target.id, source: issue.id}
                    });
                })
            }
            if (issue.linkedIssues.source.length > 0) {
                issue.linkedIssues.source.forEach((source) => {
                    if (_.findIndex(filteredIssuesIds, {id: source.id}) === -1) {
                        // Issue not found
                        let foundIssue = cfgIssues.findOne({id: source.id});
                        if (foundIssue === undefined) {
                            foundIssue = {...source, partial: true};
                        }
                        filteredIssuesIds.push({
                            data: {
                                ...foundIssue,
                                label: source.title,
                            }
                        });
                    }
                    filteredIssuesIds.push({
                        data: {source: source.id, target: issue.id}
                    });
                })
            }
        });
        return filteredIssuesIds;
    };

    render() {
        const { issues } = this.props;

        const stylesheet = [
            {
                selector: 'node',
                style: {
                    width: 10,
                    height: 10,
//                    content: 'data(id)'
                }
            },
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'width': 2,
                    'line-color': '#ddd',
                    'target-arrow-color': '#ddd'
                }
            },
            {
                selector: '[state = "OPEN"]',
                style: {
                    width: 10,
                    height: 10,
                    backgroundColor: '#28a745',
                }
            },
            {
                selector: '[state = "CLOSED"]',
                style: {
                    width: 10,
                    height: 10,
                    backgroundColor: '#cb2431',
                }
            },
        ];

        return (
            <CustomCard
                headerTitle="Issues Graph"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="To be added"
            >
                {issues.length > this.maxIssues &&
                    <span>You have too many issues in your current selection, the dataset has been automatically reduced to {this.maxIssues}</span>
                }
                <CytoscapeComponent
                    elements={[]}
                    layout={{ name: 'cose-bilkent' }}
                    style={ { height: '600px' } }
                    stylesheet={stylesheet}
                    cy={cy => this.chartRef = cy}
                />
            </CustomCard>
        );
    }
}

IssuesGraph.propTypes = {
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
});

export default connect(mapState, null)(IssuesGraph);

