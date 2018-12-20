import _ from 'lodash';
import React, { Component } from 'react';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {ResponsiveTreeMap} from "@nivo/treemap";

const styles = theme => ({
    root: {
        margin: '10px',
    },
    treemap: {
        height: '320px'
    },
    loading: {
        flexGrow: 1,
    },
});

class IssuesRepartition extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset = () => {
        const { issues } = this.props;

        let reposGroup = _.groupBy(issues.filter(issue => issue.state === 'OPEN'), 'repo.name');
        return {
            name: 'repositories'
            , color: 'hsl(67, 70%, 50%)'
            , children: Object.keys(reposGroup).map((key) => {
                    return {name: key, count: reposGroup[key].length};
                })
        };
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Open issues per repository
                        </Typography>
                        <div className={classes.treemap}>
                            <ResponsiveTreeMap
                                root={this.buildDataset()}
                                identity="name"
                                value="count"
                                innerPadding={3}
                                outerPadding={3}
                                leavesOnly={true}
                                margin={{
                                    "top": 0,
                                    "right": 0,
                                    "bottom": 0,
                                    "left": 0
                                }}
                                label="name"
                                labelFormat=""
                                labelSkipSize={40}
                                labelTextColor="inherit:darker(1.2)"
                                colors="d320"
                                colorBy="name"
                                borderColor="inherit:darker(0.3)"
                                animate={true}
                                motionStiffness={90}
                                motionDamping={11}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

IssuesRepartition.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesRepartition));