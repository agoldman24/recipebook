import React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SIGN_UP_TAB } from '../../variables/Constants';
import { SIGN_IN_REQUESTED, SET_ACTIVE_TAB, EMPTY_FIELDS, CLEAR_ERROR_MESSAGES } from '../../actions';
import { defaultTheme, formTheme, errorStyle } from '../../styles';

const useStyles = makeStyles(formTheme);

const SignInTab = props => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    props.clearErrorMessages();
    if (!username || !password) {
      props.putEmptyFieldsError();
    } else {
      props.signIn(username, password);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4" style={{fontFamily: 'Signika'}}>
          Sign in
        </Typography>
        <form className={classes.form}>
          {props.emptyFields &&
            <div style={{...errorStyle, paddingTop:'0'}}>One or more fields is empty</div>}
          {props.loginFailed &&
            <div style={{...errorStyle, paddingTop:'0'}}>Invalid username or password</div>}
          {props.networkFailed &&
            <div style={{...errorStyle, paddingTop:'0'}}>Network error</div>}
          <TextField
            InputProps={{
              classes: {
                input: classes.inputTextLowercase
              }
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            onChange={e => setUsername(e.target.value.toLowerCase())}
          />
          <TextField
            InputProps={{
              classes: {
                input: classes.inputText
              }
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            className={classes.submit}
            type="submit"
            onClick={onFormSubmit}
          >
            Sign In
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                href="#"
                style={{color: defaultTheme.palette.primary.main}}
                onClick={() => {
                  props.clearErrorMessages();
                  props.setActiveTab(SIGN_UP_TAB)
                }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    emptyFields: state.errorMessages.emptyFields,
    loginFailed: state.errorMessages.loginFailed,
    networkFailed: state.errorMessages.networkFailed
  };
};

const mapDispatchToProps = dispatch => {
  return {
    putEmptyFieldsError: () => dispatch({ type: EMPTY_FIELDS }),
    clearErrorMessages: () => dispatch({ type: CLEAR_ERROR_MESSAGES }),
    signIn: (username, password) => {
      dispatch({ type: SIGN_IN_REQUESTED, username, password });
    },
    setActiveTab: name => dispatch({
      type: SET_ACTIVE_TAB,
      currentTab: null,
      newTab: { name }
    })
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInTab);