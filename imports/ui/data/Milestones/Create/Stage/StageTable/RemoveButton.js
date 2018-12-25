import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

class RemoveButton extends Component {
    constructor (props) {
        super(props);
    }

    remove = () => {
        const { repo, repos, setRepos, verifiedRepos, setVerifiedRepos } = this.props;
        setRepos(
            repos.filter(r => r.id !== repo.id)
        );
        setVerifiedRepos(
            verifiedRepos.filter(r => r.id !== repo.id)
        );
    };

    render() {
        return (
            <IconButton aria-label="Delete" onClick={this.remove}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        );
    }
}

RemoveButton.propTypes = {
    verifiedRepos: PropTypes.array.isRequired,
    repos: PropTypes.array.isRequired,
    repo: PropTypes.object.isRequired,

    setRepos: PropTypes.func.isRequired,
    setVerifiedRepos: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedRepos: state.milestonesCreate.verifiedRepos,
    repos: state.milestonesCreate.repos,
});

const mapDispatch = dispatch => ({
    setRepos: dispatch.milestonesCreate.setRepos,
    setVerifiedRepos: dispatch.milestonesCreate.setVerifiedRepos,
});

export default connect(mapState, mapDispatch)(RemoveButton);
