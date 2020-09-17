import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { reactLocalStorage } from 'reactjs-localstorage';

const style = () => ({
  root: {},
  notifBar: {
    height: 60,
    textDecoration: 'none',
    padding: 5,
  },
});

class Notif extends Component {
  state = {
    showNotif: JSON.parse(reactLocalStorage.get('displayHeaderNotif', true)),
  };

  constructor(props) {
    super(props);
  }

  closeNotif = () => {
    reactLocalStorage.set('displayHeaderNotif', 'false');
    this.setState({
      showNotif: false,
    });
  };

  render() {
    const { classes } = this.props;

    if (!this.state.showNotif) {
      return null;
    }

    return (
      <AppBar position='static' color='default' className={classes.notifBar}>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='center'
          spacing={0}
        >
          <Grid item xs={12} sm container>
            <Grid
              container
              direction='column'
              justify='flex-start'
              alignItems='center'
              spacing={0}
            >
              <Grid item>
                An improved version of ZenCrepes is available addressing
                usability issues around performance and automated data fetching.
                You can find more details at{' '}
                <a
                  href='https://docs.zencrepes.io/docs/try'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  https://docs.zencrepes.io/docs/try
                </a>
                .
              </Grid>
              <Grid item>
                ZenCrepes is still entirely{' '}
                <a
                  href='https://github.com/zencrepes/zui/blob/master/LICENSE'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Open-Source
                </a>{' '}
                and needs your help, so do not hesitate to reach out on{' '}
                <a
                  href='https://github.com/zencrepes/zencrepes/issues'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {' '}
                  GitHub!
                </a>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton
              aria-label='Delete'
              className={classes.margin}
              onClick={this.closeNotif}
            >
              <CloseIcon fontSize='small' color='primary' />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
    );
  }
}

Notif.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(Notif);
