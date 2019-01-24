import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { setLoadFlag, setStageFlag } = this.props;
        setStageFlag(false);
        setLoadFlag(true);
    };

    render() {
        const { verifiedLabels, labels } = this.props;

        const errors = verifiedLabels.filter(label => label.error === true);
        //The apply button is disabled until all labels have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="contained"
                color="primary"
                disabled={verifiedLabels.filter(label => label.error === false).length !== labels.length}
                onClick={this.apply}
            >
                Apply
                {errors.length > 0 &&
                    <span>
                        ({errors.length} errors)
                    </span>
                }
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    verifiedLabels: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedLabels: state.labelsEdit.verifiedLabels,
    labels: state.labelsEdit.labels,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsEdit.setLoadFlag,
    setStageFlag: dispatch.labelsEdit.setStageFlag,
});

export default connect(mapState, mapDispatch)(ApplyButton);