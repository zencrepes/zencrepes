import _ from 'lodash';
import React, { Component } from 'react';

import CustomCard from "../../../../../components/CustomCard/index.js";
import IssueCompact from '../../../../../components/Issue/IssueTooltip.js';

import PropTypes from "prop-types";
import {connect} from "react-redux";

import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
//import cytoscapeQtip from 'cytoscape-qtip';

import popper from 'cytoscape-popper';

import Tippy from 'tippy.js';
import 'tippy.js/themes/light-border.css';
import ReactDOMServer from 'react-dom/server';

import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use(COSEBilkent);
Cytoscape.use(popper);

class IssuesGraph extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.tippyInstances = {};
        this.selectedTippies = {};
        this.clickedLink = false;
    }

    componentDidUpdate() {
        this.clickedLink = false;
        this.updateChart(this.chartRef);
    }

    componentDidMount() {
        const { setGraphNode } = this.props;
        setGraphNode(this.chartRef);
        this.updateChart(this.chartRef);
    }

    // TO-DO This is very hacky, need a better implementation
    shouldComponentUpdate(nextProps) {
        const { issuesGraph } = this.props;
        const sourceNodes = issuesGraph.map(node => node.id);
        const updatedNodes = nextProps.issuesGraph.map(node => node.id);
        if (_.isEqual(_.sortBy(sourceNodes), _.sortBy(updatedNodes))) {
            return false;
        } else {
            return true;
        }
    }

    clickIssue = (issue) => {
        const { setUpdateQueryPath, setUpdateQuery } = this.props;
        if (this.clickedLink === false) {
            this.clickedLink = true;
            const query = {'id': {'$in': [issue.id]}};
            setUpdateQuery(query);
            setUpdateQueryPath('/issues/graph');
        }
    };

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
        const { issuesGraph } = this.props;
        this.clearTippies();
        cy.elements().remove();
        cy.add(issuesGraph);

        cy.on("mouseover", "node", (event) => {
            const nodeId = event.target.id();
            const dataNode = event.target.data();
            const node = event.target;
            if (this.tippyInstances[nodeId] === undefined) {
                this.tippyInstances[nodeId] = this.makeTippy(node, dataNode.title, dataNode);
                this.tippyInstances[nodeId].show();
            }
        });

        cy.on("mouseout", "node", (event) => {
            const nodeId = event.target.id();
            if (this.tippyInstances[nodeId] !== undefined) {
                this.tippyInstances[nodeId].hide();
                this.tippyInstances[nodeId].destroy();
                delete this.tippyInstances[nodeId];
            }
        });

        cy.on("click", "node", (event) => {
            const nodeData = event.target.data();
            this.clickIssue(nodeData);
        });

        let layout = cy.layout({
            name: 'cose-bilkent',
            animate: false
        });
        layout.run();
    };

    render() {
        const stylesheet = [
            {
                selector: 'node',
                style: {
                    width: 10,
                    height: 10,
//                    content: 'data(id)'
//                    shape: 'vee'
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
                selector: ':parent',
                style: {
                    'background-opacity': 0.333
                }
            },
            {
                selector: '[state = "OPEN"]',
                style: {
                    backgroundColor: '#28a745',
                }
            },
            {
                selector: '[state = "CLOSED"]',
                style: {
                    backgroundColor: '#cb2431',
                }
            },
            {
                selector: '[?partial]',
                style: {
                    shape: 'rectangle'
                }
            },
            {
                selector: '[distance = 0]',
                style: {
                    width: 20,
                    height: 20,
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
    issuesGraph: PropTypes.array.isRequired,

    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
    setGraphNode: PropTypes.func.isRequired,
};

const mapState = state => ({
    issuesGraph: state.issuesView.issuesGraph,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
    setGraphNode: dispatch.issuesView.setGraphNode,
});

export default connect(mapState, mapDispatch)(IssuesGraph);

