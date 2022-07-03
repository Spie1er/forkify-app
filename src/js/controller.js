import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import RecipeView from './views/recipeView';
import SearchView from './views/searchView';
import ResultsView from './views/resultsView';
import PaginationView from './views/paginationView';
import BookmarksView from './views/bookmarksView';
import AddRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    RecipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    ResultsView.update(model.getSearchResultsPage());
    // 1) LOAD RECIPE
    await model.loadRecipe(id);

    // 2) RENDER RECIPE
    RecipeView.render(model.state.recipe);

    // 3) Updating Bookmarks
    BookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    RecipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();

    // 1) Get Search Query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render Results
    ResultsView.render(model.getSearchResultsPage());

    // 4) Render Initial Pagination
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW Results
  ResultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW Pagination
  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings in state
  model.updateServings(newServings);

  // Update the recipe view
  // RecipeView.render(model.state.recipe);
  RecipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  RecipeView.update(model.state.recipe);

  //3) Render bookmarks

  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show Spinner
    AddRecipeView.renderSpinner();

    // Upload recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    RecipeView.render(model.state.recipe);

    // Success Message
    AddRecipeView.renderMessage();

    // Render bookmark view
    BookmarksView.render(model.state.bookmarks);

    // Chnage ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🌶', err);
    AddRecipeView.renderError(err.message);
  }
};

const init = function () {
  BookmarksView.addHandlerRennder(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
