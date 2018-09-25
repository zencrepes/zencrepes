import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import {buildMongoSelector} from "../../../utils/mongo";
import {cfgIssues} from "../../../data/Minimongo";

import ProgressBar from "../../../components/Loading/Issues/ProgressBar";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class Create extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
        }
    };

    refreshFull = () => {
        console.log('refreshFull');
        const { setLoadFlag } = this.props;
        setLoadFlag({
            issues: 'true',
            labels: 'false'
        });
    };

    refreshQuick = () => {
        console.log('refreshQuick');
        const { setLoadFlag, setLoadRepos, filters } = this.props;
        //Get list of repositories for current query
        let mongoSelector = buildMongoSelector(filters);
        let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};
        let reposGroup = Object.keys(_.groupBy(cfgIssues.find(openedIssuesFilter).fetch(), 'repo.id'));
        setLoadRepos(reposGroup);
        setLoadFlag({
            issues: 'true',
            labels: 'false'
        });

    };

    render() {
        const { classes, loading, loadSuccess, issuesLoadedCount } = this.props;

        return (
            <div className={classes.root}>
                {!loading &&
                    <div>
                        <Button variant="raised" color="primary" className={classes.button} onClick={this.refreshFull}>
                            Create Sprint
                        </Button>
                    </div>
                }
                {loading &&
                    <ProgressBar />
                }
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                    open={loadSuccess}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Loaded or updated {issuesLoadedCount} issues</span>}
                />
            </div>
        )
    };
}

Create.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});


export default connect(mapState, mapDispatch)(withStyles(styles)(Create));
