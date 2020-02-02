import React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ADD_USER, SET_ACTIVE_TAB } from '../actions';
import { SIGN_IN_TAB, defaultTheme } from '../variables/Constants';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: defaultTheme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  inputText: {
    fontSize: '16px',
  },
  inputTextLowercase: {
    fontSize: '16px',
    textTransform: 'lowercase'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));
 
const SignUp = props => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !password) {
      alert("One or more fields is empty");
    } else {
      props.addUser(firstName, lastName, username, password);
    }
  }

  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputText
                    }
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  onChange={e => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputText
                    }
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="Last Name"
                  onChange={e => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputTextLowercase
                    }
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="Username"
                  onChange={e => setUsername(e.target.value.toLowerCase())}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.inputText
                    }
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              type="submit"
              onClick={onFormSubmit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  color="primary"
                  onClick={() => props.setActiveTab(SIGN_IN_TAB)}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    addUser: (firstName, lastName, username, password) => dispatch({
      type: ADD_USER, firstName, lastName, username, password
    }),
    setActiveTab: tab => dispatch({ type: SET_ACTIVE_TAB, tab })
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);