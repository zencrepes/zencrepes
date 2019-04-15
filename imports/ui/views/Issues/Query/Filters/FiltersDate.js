import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const styles = {
    root: {
        marginLeft: '5px',
    },
};

class FiltersDate extends Component {
    constructor (props) {
        super(props);
    }

    handleDelete = () => {
        const { updateQueryDate, datefilter} = this.props;
        updateQueryDate(datefilter.idx, 'after', null);
    };

    render() {
        const { classes, query, datefilter, updateQueryDate} = this.props;

        let dateValue = '';
        if (query[datefilter.idx]['$lt'] !== undefined) {
            dateValue = format(parseISO(query[datefilter.idx]['$lt']), 'LLL do yyyy');
        } else {
            dateValue = format(parseISO(query[datefilter.idx]['$gt']), 'LLL do yyyy');
        }

        return (
            <div className={classes.root}>
                <span>{datefilter.name} </span>

                {query[datefilter.idx]['$lt'] !== undefined &&
                    <span>before</span>
                }
                {query[datefilter.idx]['$gt'] !== undefined &&
                    <span>after</span>
                }
                {updateQueryDate === null ? (
                    <Chip variant="outlined" label={dateValue} className={classes.root} />
                ) : (
                    <Chip onDelete={this.handleDelete} variant="outlined" label={dateValue} className={classes.root} />
                )}
            </div>
        );
    }
}

FiltersDate.propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    datefilter: PropTypes.object.isRequired,
    updateQueryDate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string
    ])
};

export default withStyles(styles)(FiltersDate);
