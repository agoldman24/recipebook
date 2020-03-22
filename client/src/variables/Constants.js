export const RECIPE_TAB = "RECIPE_TAB";
export const SIGN_IN_TAB = "SIGN_IN_TAB";
export const SIGN_UP_TAB = "SIGN_UP_TAB";
export const SEARCH_TAB = "SEARCH_TAB";
export const WELCOME_TAB = "WELCOME_TAB";
export const PROFILE_TAB = "PROFILE_TAB";
export const PROFILE_IMAGE = "PROFILE_IMAGE";
export const SAVED_RECIPE_IDS = "SAVED_RECIPE_IDS";
export const FRIEND_IDS = "FRIEND_IDS";
export const FRIENDS = "FRIENDS";
export const CREATED_RECIPES = "CREATED RECIPES";
export const SAVED_RECIPES = "SAVED_RECIPES";

export const defaultTheme = {
  palette: {
    type: 'dark',
    background: {
      default: '#202020'
    },
    primary: {
      main: '#ffe100',
      mainGradient: 'linear-gradient(to top right, #ff4000, yellow)'
    },
    secondary: {
      main: '#ff441f'
    }
  }
}

export const gradientTextStyle = {
  background: defaultTheme.palette.primary.mainGradient,
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent'
}

export const gradientTextStyle2 = {
  background: 'linear-gradient(to top right, yellow, #ff4000)',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent'
}

export const formTheme = theme => ({
  paper: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    background: defaultTheme.palette.primary.mainGradient,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
    zIndex: '3'
  },
  inputText: {
    fontSize: '16px'
  },
  inputTextLowercase: {
    fontSize: '16px',
    textTransform: 'lowercase'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: 'Signika',
    background: defaultTheme.palette.primary.mainGradient
  }
});