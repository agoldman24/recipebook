import { WELCOME_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: { name: WELCOME_TAB },
  isSpinnerVisible: false,
  isDrawerMenuVisible: false,
  isHydrated: false,
  tabHistory: [],
  snackbar: {
    isVisible: false,
    message: ""
  },
  errorMessages: {
    emptyFields: false,
    usernameExists: false,
    loginFailed: false,
    networkFailed: false
  },
  users: {},
  usersFetched: false,
  activeUser: {
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    profileImage: null,
    followerIds: [],
    followingIds: [],
    draftRecipeIds: [],
    createdRecipeIds: [],
    likedRecipeIds: []
  },
  displayUser: {
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    profileImage: null,
    followerIds: [],
    followingIds: [],
    draftRecipeIds: [],
    createdRecipeIds: [],
    likedRecipeIds: []
  },
  displayUserDetail: {
    profileImage: null,
    followers: {},
    following: {},
    createdRecipes: {},
    likedRecipes: {},
    activeDetail: ""
  },
  profileEditor: null,
  recipeCategory: "Anonymous",
  recipeEditMode: false,
  sampleRecipes: {},
  friendRecipes: {},
  createdRecipes: {},
  allRecipesFetched: {
    samples: false,
    friends: false,
    created: false,
    liked: false,
    displayUserCreated: false
  },
  icons: [],
  iconFetchMessage: ""
});