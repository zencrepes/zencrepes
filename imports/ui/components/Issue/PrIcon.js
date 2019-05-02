import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import Octicon, {getIconByName} from '@githubprimer/octicons-react';

const styles = {
    base: {
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 600,
        lineHeight: '12px',
        color: 'rgb(255, 255, 255)',
        fontSize: '12px',
        textAlign: 'center',
        backgroundColor: 'rgb(44, 190, 78)',
        padding: '4px 8px',
        borderRadius: '3px',
    },
    link: {
        textDecoration: 'none'
    }
};


//For some reason the small of Label in primercomponents didn't work for small, created a temporary version
class Issue extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, pr } = this.props;
        const states = {
            'OPEN': {
                color: '#28a745',
                icon: 'git-pull-request'
            },
            'MERGED': {
                color: '#6f42c1',
                icon: 'git-merge'
            },
            'CLOSED': {
                color: '#cb2431',
                icon: 'git-merge'
            },
        };
        return (
            <Tooltip title={"[" + pr.state + "] " + pr.title}>
                <a
                    href={pr.url}
                    className={classes.link}
                    rel="noopener noreferrer" target="_blank">
                    <span className={classes.base} style={{backgroundColor: states[pr.state].color}}>
                        <Octicon icon={getIconByName(states[pr.state].icon)} />&nbsp;
                        #{pr.number}
                    </span>
                </a>
            </Tooltip>
        );
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
    pr: PropTypes.object.isRequired,
};

export default withStyles(styles)(Issue);
