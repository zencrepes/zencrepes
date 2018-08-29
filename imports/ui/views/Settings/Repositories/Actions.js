import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions';
import Button from "@material-ui/core/Button";

import { cfgIssues, cfgLabels } from "../../../data/Minimongo.js";


const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: '10px',
    },
    listItem: {
        padding: '0px',
    },
    actionButtons: {
        textAlign: 'right',
    },
    loading: {
        flexGrow: 1,
    },
});

class Actions extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    deleteIssues = () => {
        console.log('deleteIssues');
        cfgIssues.remove({});
    };

    deleteLabels = () => {
        console.log('deleteLabels');
        cfgLabels.remove({});
    };

    render() {
        const { classes, loading  } = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        {!loading &&
                            <Typography className={classes.title} color="textSecondary">
                                Currently loaded in memory: {cfgIssues.find({}).count()} issues, {cfgLabels.find({}).count()} labels
                            </Typography>
                        }
                        {loading &&
                            <Typography className={classes.title} color="textSecondary">
                                Repos currently being updated, please wait.
                            </Typography>
                        }
                    </CardContent>
                    <CardActions className={classes.cardActions} >
                        {!loading &&
                            <div className={classes.actionButtons} >
                                <Button color="primary" variant="raised" className={classes.button} onClick={this.deleteIssues}>
                                    DELETE ALL ISSUES
                                </Button>
                                <Button color="primary" variant="raised" className={classes.button} onClick={this.deleteLabels}>
                                    DELETE ALL LABELS
                                </Button>
                            </div>
                        }
                    </CardActions>
                </Card>
            </div>
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    loading: state.githubFetchReposContent.loading,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));