import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions';
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import ProgressBar from "../../../components/Loading/Issues/ProgressBar";
import ProgressText from "../../../components/Loading/Issues/ProgressText";

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

class Selects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load_issues: true,
            load_labels: true,
        };
    }

    componentDidMount() {
        for (let key in this.state) {
            // if the key exists in localStorage
            if (localStorage.hasOwnProperty(key)) {
                // get the key's value from localStorage
                let value = localStorage.getItem(key);

                // parse the localStorage string and setState
                try {
                    value = JSON.parse(value);
                    this.setState({ [key]: value });
                } catch (e) {
                    // handle empty string
                    this.setState({ [key]: value });
                }
            } else {
                localStorage.setItem(key, this.state[key]);
            }
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
        }
    };

    loadIssues = () => {
        console.log('loadIssues');
        const { setLoadFlag } = this.props;
        setLoadFlag({
            issues: localStorage.getItem('load_issues'),
            labels: localStorage.getItem('load_labels')
        });
    };

    cancelLoad = () => {
        console.log('cancelLoad');
        this.props.setLoading(false);
    };


    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        localStorage.setItem(name, event.target.checked);
    };

    render() {
        const { classes, loading, loadSuccess, issuesLoadedCount  } = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Select the type of data to load
                        </Typography>
                        <List>
                            <ListItem className={classes.listItem}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.load_issues}
                                            onChange={this.handleChange('load_issues')}
                                            value="load_issues"
                                            color="primary"
                                        />
                                    }
                                    label="Issues"
                                />
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.load_labels}
                                            onChange={this.handleChange('load_labels')}
                                            value="load_labels"
                                            color="primary"
                                        />
                                    }
                                    label="Labels"
                                />
                            </ListItem>
                        </List>
                        {loading &&
                            <div className={classes.loading}>
                                <ProgressBar />
                                <ProgressText />
                                <Button onClick={this.cancelLoad} color="primary" autoFocus>
                                    Cancel Load
                                </Button>
                            </div>
                        }
                    </CardContent>
                    {!loading &&
                    <CardActions className={classes.cardActions} >
                        <div className={classes.actionButtons} >
                            <Button color="primary" variant="raised" className={classes.button} onClick={this.loadIssues}>
                                BIG LOAD BUTTON
                            </Button>
                        </div>
                    </CardActions>
                    }
                </Card>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                    open={loadSuccess}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Loaded or updated {issuesLoadedCount} issues</span>}
                />
            </div>
        );
    }
}

Selects.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    loadSuccess: PropTypes.bool,
    issuesLoadedCount: PropTypes.number,
    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
    setLoadSuccess: PropTypes.func,
};

const mapState = state => ({
    loading: state.githubFetchReposContent.loading,
    loadSuccess: state.githubFetchReposContent.loadSuccess,

    issuesLoadedCount: state.githubIssues.loadedCount,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchReposContent.setLoadFlag,
    setLoading: dispatch.githubFetchReposContent.setLoading,

    setLoadSuccess: dispatch.githubFetchReposContent.setLoadSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Selects));