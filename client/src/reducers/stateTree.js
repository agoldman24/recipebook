import { WELCOME_TAB } from "../variables/Constants";

export default Object.assign({},
{
  activeTab: { name: WELCOME_TAB },
  isSpinnerVisible: false,
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
    createdRecipeIds: [],
    likedRecipeIds: []
  },
  displayUser: {
    id: "",
    username: "",
    firstName: "",
    lastName: ""
  },
  displayUserDetail: {
    profileImage: null,
    followers: {},
    following: {},
    createdRecipes: {},
    createdRecipeIds: {},
    likedRecipes: {},
    likedRecipeIds: {},
    activeDetail: ""
  },
  profileEditor: null,
  recipeCategory: "All",
  recipeEditMode: false,
  detailRecipe: null,
  allRecipes: {},
  oldestFetchedRecipeTimestamp: Date.now(),
  refreshNeeded: false,
  friendRecipes: {},
  createdRecipes: {},
  isLiking: false,
  isPosting: false,
  isUpdatingFollowers: false,
  isFetchingRecipes: false,
  recipesFetched: {
    all: false,
    friends: false,
    created: false,
    liked: false,
    displayUserCreated: false
  }
});