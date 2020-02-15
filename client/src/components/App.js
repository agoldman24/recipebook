import React from 'react';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import BottomBar from './BottomBar';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';
import SignIn from './SignIn';
import SignUp from './SignUp';
import RecipeTab from './RecipeTab';
import SearchTab from './SearchTab';
import SuccessSnackbar from './SuccessSnackbar';
import { FETCH_USER, FETCH_RECIPE_REQUESTED } from '../actions';
import { SEARCH_TAB, SIGN_UP_TAB, RECIPE_TAB, SIGN_IN_TAB, defaultTheme }
from '../variables/Constants';

class App extends React.Component {
  componentDidMount() {
    document.getElementById('root').scrollTo(0, 0);
    if (!!localStorage.getItem("username")) {
      this.props.fetchUser(
        localStorage.getItem("username"),
        localStorage.getItem("password")
      );
    }
    if (!Object.keys(this.props.activeRecipes).length) {
      this.props.getRandomRecipe();
    }
  }
  render() {
    return (
      <ThemeProvider theme={
        createMuiTheme(defaultTheme)
      }>
        {this.props.isSpinnerVisible && <Spinner />}
        <SuccessSnackbar/>
        <TabPanel />
        {this.props.activeTab === SEARCH_TAB && <SearchTab />}
        <BottomBar />
        <Container
          component="main"
          maxWidth="xs"
          style={{padding:"50px 0 10px"}}
        >
          <CssBaseline />
          {this.props.activeTab === SIGN_UP_TAB && <SignUp />}
          {this.props.activeTab === RECIPE_TAB && <RecipeTab />}
          {this.props.activeTab === SIGN_IN_TAB && <SignIn />}
        </Container>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    activeRecipes: state.activeRecipes,
    isSpinnerVisible: state.isSpinnerVisible,
    isDetailVisible: state.isDetailVisible,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: (username, password) => dispatch({
      type: FETCH_USER, username, password
    }),
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);