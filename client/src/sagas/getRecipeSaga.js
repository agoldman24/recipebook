import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/siteUrl';

import {
  GET_RECIPE_REQUESTED,
  APPEND_DISPLAY_RECIPES,
  NETWORK_FAILED,
  CLEAR_ERROR_MESSAGES
} from '../actions';

function* getRecipe() {
  yield put({ type: CLEAR_ERROR_MESSAGES });
  try {
    const { data } = yield call(Api.get, '/getSamples');
    yield put({
      type: APPEND_DISPLAY_RECIPES,
      recipes: data.recipes
    });
  } catch (err) {
    yield put({ type: NETWORK_FAILED });
    console.log(err);
  }
}

function* getRecipeSaga() {
  yield takeLatest(GET_RECIPE_REQUESTED, getRecipe);
}

export default getRecipeSaga;