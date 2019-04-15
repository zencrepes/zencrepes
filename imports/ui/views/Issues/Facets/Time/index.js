import React, { Component } from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import blue from '@material-ui/core/colors/blue';

import DateSelector from './DateSelector.js';
import TimeModal from './Modal/index.js';

const styles = {
    root: {
        marginBottom: '10px',
    },
    cardContent: {
        padding: '0px',
    },
    noFilter: {
        padding: '10px',
    }
};

const cardStyle = {
    borderLeft: '4px solid ' + blue[900],
    borderTop: '1px solid #ccc',
    borderRadius: '0px',
    background: '#fafafa',
};

const cardHeaderStyle = {
    padding: '5px 2px 5px 5px',
    fontSize: '1.2rem',
    fontWeight: '300',
};

const cardContentStyle = {
    padding: '0px',
};

class TimeFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
            selectAll: false,
        };
    }

    openModal = () => {
        const { setShowTimeModal } = this.props;
        setShowTimeModal(true);
    };

    render() {
        const { classes, query, addRemoveDateQuery, timeFields } = this.props;

        const activeDateFields = timeFields.filter(field => query[field.idx] !== undefined);

        return (
            <div className={classes.root}>
                <TimeModal
                    addRemoveDateQuery={addRemoveDateQuery}
                />
                <Card style={cardStyle}>
                    <CardContent style={cardHeaderStyle}>
                        <span>Date Filter</span>
                    </CardContent>
                    <CardContent style={cardContentStyle}>
                        <List dense={this.state.dense}>
                            {activeDateFields.length === 0 &&
                                <span className={classes.noFilter}>No date filters configured</span>
                            }
                            {activeDateFields.map(value => (
                                <DateSelector
                                    data={value}
                                    key={value.idx}
                                    query={query}
                                    addRemoveDateQuery={addRemoveDateQuery}
                                />
                            ))}
                        </List>
                    </CardContent>
                    <CardActions>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item xs={12} sm container>
                            </Grid>
                            <Grid item>
                                <Button color="primary" size="small" className={classes.button} onClick={this.openModal}>Add</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

TimeFacet.propTypes = {
    classes: PropTypes.object.isRequired,
    timeFields: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    setShowTimeModal: PropTypes.func.isRequired,
    addRemoveDateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    timeFields: state.issuesView.timeFields,
});

const mapDispatch = dispatch => ({
    setShowTimeModal: dispatch.issuesView.setShowTimeModal,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(TimeFacet));

