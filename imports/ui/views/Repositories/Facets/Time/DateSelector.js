import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import blue from '@material-ui/core/colors/blue';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const styles = {
    root: {

    },
    listItem: {
        marginLeft: '5px',
        padding: '0px',
        height: '20px',
        borderBottom: '1px dashed #e6e6e6',
    },
    listItemText: {
        marginLeft: '5px',
        padding: '0px',
    },
    chip: {
        height: '18px',
    },
    checkbox: {
        height: '15px',
        width: '15px',
        color: blue[500],
        padding: '5px',
    }
};

class DateSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    handleToggle = clickedValue => () => {
        const { addRemoveDateQuery } = this.props;
        addRemoveDateQuery(clickedValue.idx, 'after', null);
    };

    render() {
        const { data, classes, query } = this.props;
        let facetTitle = data.name;
        if (query[data.idx]['$lt'] !== undefined) {
            facetTitle = facetTitle + ' before ' + format(parseISO(query[data.idx]['$lt']), 'LLL do yyyy');
        } else {
            facetTitle = facetTitle + ' after ' + format(parseISO(query[data.idx]['$gt']), 'LLL do yyyy');
        }
        return (
            <ListItem
                key={data.idx}
                role={undefined}
                dense
                button
                onClick={this.handleToggle(data)}
                className={classes.listItem}
            >
                <Checkbox
                    checked={true}
                    tabIndex={-1}
                    disableRipple
                    className={classes.checkbox}
                />
                <Tooltip title={data.name}>
                    <ListItemText primary={facetTitle} className={classes.listItemText} />
                </Tooltip>
            </ListItem>
        );
    }
}

DateSelector.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    addRemoveDateQuery: PropTypes.func.isRequired,
};

export default withStyles(styles)(DateSelector);