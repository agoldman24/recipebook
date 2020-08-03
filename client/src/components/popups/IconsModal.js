import React, { useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { GET_ICONS_REQUESTED } from '../../actions';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    width: isMobile ? '300px' : '400px'
  },
  button: {
    float: 'right',
    height: '35px',
    background: 'black'
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    margin: '8px 13px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    width: '80%',
    outline: '1px solid white',
    background: '#202020',
    fontSize: '16px'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: '100%'
  }
}));

const IconsModal = props => {
  const { isVisible, closeModal } = props;
  const [searchVal, setSearchVal] = useState("");
  const classes = useStyles();
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isVisible}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isVisible}>
          <Grid container direction="column" className={classes.paper}>
            <Grid item>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search icons..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onKeyPress={event => {
                  if (!!searchVal.length && event.charCode === 13) {
                    document.getElementById('search').click();
                  }
                }}
                inputProps={{'aria-label':'search'}}
                onChange={e => setSearchVal(e.target.value.toLowerCase())}
              />
              <Button id="search"
                className={classes.button}
                disabled={!searchVal.length}
                onClick={() => props.getIcons(searchVal)}
              >
                Search
              </Button>
            </Grid>
            <Grid item>{props.icons.length}</Grid>
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    icons: state.icons
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getIcons: searchWord => dispatch({ type: GET_ICONS_REQUESTED, searchWord })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IconsModal);