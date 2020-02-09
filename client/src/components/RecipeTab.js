import React from 'react';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import RecipeButtons from './RecipeButtons';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';

const errorStyle = { textAlign:'center', color:'#ff2200', paddingTop:'50px' };

class RecipeTab extends React.Component {
  componentDidMount() {
    if (!Object.keys(this.props.activeRecipes).length) {
      this.props.getRandomRecipe();
    }
  };

  render() {
    return (
      <div>
        <Grid
          container
          justify="center"
        >
          {this.props.networkFailed
            ? <div style={errorStyle}>Network error</div>
            : Object.keys(this.props.activeRecipes).map((id, index, arr) => {
                const recipe = this.props.activeRecipes[id];
                return (
                  <Grid item>
                    <RecipeCard
                      key={index}
                      name={recipe.name}
                      image={recipe.image}
                      ingredients={recipe.ingredients}
                      directions={recipe.directions}
                    />
                  </Grid>
                );
              })
            }
        </Grid>
        {this.props.isLoggedIn && <RecipeButtons />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    networkFailed: state.networkFailed,
    activeRecipes: state.activeRecipes
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);