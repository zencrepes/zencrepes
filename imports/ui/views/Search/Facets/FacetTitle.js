import React from 'react';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

class FacetTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { title } = this.props;

        return (
            <Toolbar>
                <Typography variant="title" color="inherit">
                    {title}
                </Typography>
            </Toolbar>
        );
    }
}

export default FacetTitle;