import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import IngredientsTable from '../tables/IngredientsTable';
import PromptModal from '../popups/PromptModal';
import IconsModal from '../popups/IconsModal';
import FileBase from 'react-file-base64';
import { b64toBlob } from '../../utilities/imageConverter';
import {
  borderStyle, sectionTitleStyle, radioLabelStyle,
  fabStyle, buttonStyle, iconStyle, errorStyle,
  defaultTheme, inputTheme
} from '../../styles';
import '../../index.css';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px 0 4px 4px',
    border: '1px solid white',
    marginTop: '3px'
  },
  inputText: {
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '15px 10px'
  },
  inputTextReducedPadding: {
    fontSize: '16px',
    padding: '10px'
  },
  multilineInputText: {
    fontSize: '16px',
    lineHeight: '1.5'
  },
  multilineTextField: {
    padding: '10px 5px 10px 12px'
  },
  wrapper: {
    width: '100%'
  },
  whiteRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white'
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      color: 'white',
      marginTop: '-4px'
    }
  },
  redRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: errorStyle.color,
      },
      '&:hover fieldset': {
        borderColor: errorStyle.color,
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      color: 'white',
      marginTop: '-4px'
    }
  },
  yellowRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: defaultTheme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: defaultTheme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      color: defaultTheme.palette.primary.main,
      marginTop: '-4px'
    }
  }
}));

const rightSideActionStyle = {
  float: 'right',
  width: isMobile ? '40%' : '30%'
}

const addButtonStyle = {
  ...buttonStyle,
  width: '100%',
  color: '#45bbff',
  border: '2px solid #45bbff'
}

const iconButtonStyle = {
  ...fabStyle,
  color: 'white',
  float: 'right',
  height: '20px',
  width: '30px'
}

const roundedButtonStyle = {
  width: '80%',
  color: 'orange',
  border: '2px solid orange',
  fontWeight: 'bold',
  borderRadius: '50px',
  background: '#292929',
  margin: '5px 10%'
}

const fullWidth = {
  width: '100%'
}

const errorMessageStyle = {
  width: '35%',
  margin: 'auto',
  paddingRight: '10px',
  color: errorStyle.color
}

const RecipeForms = props => {
  const classes = useStyles();
  const {
    originalName,
    originalImage,
    originalIngredients,
    originalDirections,
    tableRef,
    isEditMode,
    addIngredientMode, toggleAddIngredientMode,
    editIngredientMode, toggleEditIngredientMode,
    setIsSaveEnabled,
    isErrored,
    isNameEmpty, setIsNameEmpty,
    isImageEmpty, setIsImageEmpty,
    isIngredientsEmpty, setIsIngredientsEmpty,
    isDirectionsEmpty, setIsDirectionsEmpty
  } = props;
  const [isIconsModalVisible, setIconsModalVisible] = useState(false);
  const [isFileTypeModalVisible, setFileTypeModalVisible] = useState(false);
  const [isDeleteIngredientModalVisible, setDeleteIngredientModalVisible] = useState(false);
  const [isDeleteStepModalVisible, setDeleteStepModalVisible] = useState(false);
  const [focusedContainer, setFocusedContainer] = useState(isEditMode ? "image" : null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState(originalName);
  const [image, setImage] = useState(originalImage);
  const [directionsParagraph, setDirectionsParagraph] = useState(
    typeof originalDirections === "string" ? originalDirections : "");
  const [directionSteps, setDirectionSteps] = useState(
    typeof originalDirections === "string" ? [] : originalDirections);
  const [focusedStep, setFocusedStep] = useState(null);
  const [directionsType, setDirectionsType] = useState(typeof originalDirections);
  const [ingredients, setIngredients] = useState(originalIngredients.map((ingredient, index) => ({
    ...ingredient, index, isModified: false
  })));
  const [deletedIndex, setDeletedIndex] = useState(0);
  const [addStepMode, setAddStepMode] = useState(false);
  const containersDisabled = addIngredientMode || editIngredientMode;

  const setFocus = container => {
    if (container !== focusedContainer) {
      if (focusedContainer === "directions"
        && directionsType === "object"
        && directionSteps.length
        && !directionSteps[directionSteps.length - 1].length
      ) {
        handleStepDelete(directionSteps.length - 1);
      }
      setFocusedContainer(container);
    }
  }

  const setGlobalDiff = (
    newName = name,
    newImage = image,
    newIngredients = ingredients,
    newDirectionsType = directionsType,
    newDirectionsParagraph = directionsParagraph,
    newDirectionSteps = directionSteps
  ) => {
    const ingredientsDiff = ingredientsAreDifferent(newIngredients);
    const directionsDiff = directionsAreDifferent(
      newDirectionsType,
      newDirectionsParagraph,
      newDirectionSteps
    );
    setIsSaveEnabled(
      newName !== originalName ||
      newImage !== originalImage ||
      ingredientsDiff || directionsDiff
    );
    setIsNameEmpty(!newName.length);
    setIsImageEmpty(!newImage);
    setIsIngredientsEmpty(!newIngredients.length);
    setIsDirectionsEmpty(newDirectionsType === "string"
      ? !newDirectionsParagraph.length
      : !newDirectionSteps.length
    );
  }

  const onImageChange = file => {
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      setFileTypeModalVisible(true);
    } else {
      const data = file.base64.toString();
      const newImage = URL.createObjectURL(b64toBlob(data));
      setImage(newImage);
      setAnchorEl(null);
      setGlobalDiff(undefined, newImage);
    }
  }

  const handleIngredientChange = ingredient => {
    let newIngredients = [...ingredients];
    newIngredients[ingredient.index] = ingredient;
    setIngredients(newIngredients);
    setGlobalDiff(undefined, undefined, newIngredients);
  }

  const handleIngredientAdd = ingredient => {
    let newIngredients = [ingredient, ...ingredients.map(i => ({ ...i, index: i.index + 1 }))];
    setIngredients(newIngredients);
    setGlobalDiff(undefined, undefined, newIngredients);
  }

  const handleIngredientDelete = index => {
    setDeleteIngredientModalVisible(false);
    const newIngredients = ingredients.reduce((accum, ingredient) => {
      if (ingredient.index !== index) {
        accum.push(ingredient)
      }
      return accum;
    }, []).map((ingredient, index) => ({
      ...ingredient, index
    }));
    setIngredients(newIngredients);
    setGlobalDiff(undefined, undefined, newIngredients);
  }

  const handleStepDelete = index => {
    setDeleteStepModalVisible(false);
    let currentSteps = [ ...directionSteps ];
    currentSteps.splice(index, 1);
    setDirectionSteps(currentSteps);
    setGlobalDiff(undefined, undefined, undefined, undefined, undefined, currentSteps);
  }

  const directionsAreDifferent = (
    newDirectionsType = directionsType,
    newDirectionsParagraph = directionsParagraph,
    newDirectionSteps = directionSteps
  ) => {
    if (isEditMode && newDirectionsType !== typeof originalDirections) {
      return true;
    };
    if (newDirectionsType === "string") {
      return newDirectionsParagraph.replace(/\s+/g, '') !== originalDirections.replace(/\s+/g, '');
    } else {
      if (newDirectionSteps.length !== originalDirections.length) {
        return true;
      }
      newDirectionSteps.forEach((direction, index) => {
        if (direction !== originalDirections[index]) {
          return true;
        }
      });
    }
    return false;
  }

  const ingredientsAreDifferent = (newIngredients = ingredients) => {
    return newIngredients.length !== originalIngredients.length
      || newIngredients.filter(i => i.isModified).length;
  }

  return (
    <ClickAwayListener
      onClickAway={e => {
        if (!anchorEl &&
          !containersDisabled &&
          !isIconsModalVisible &&
          !isDeleteIngredientModalVisible &&
          !isDeleteStepModalVisible
        ) {
          setFocus(null);
          e.target.click();
        }
      }}
    >
    <div style={fullWidth}>
      <IconsModal
        isVisible={isIconsModalVisible}
        closeModal={() => setTimeout(() => setIconsModalVisible(false), 1)}
        onConfirm={icon => {
          setImage(icon);
          setGlobalDiff(undefined, icon);
          setTimeout(() => setAnchorEl(null), 1);
        }}
      />
      <PromptModal
        modalType="okay"
        isVisible={isFileTypeModalVisible}
        closeModal={() => setFileTypeModalVisible(false)}
        message={"Invalid file type. Please choose a PNG or JPEG file."}
      />
      <PromptModal
        modalType="delete"
        isVisible={isDeleteIngredientModalVisible}
        closeModal={() => setTimeout(() => setDeleteIngredientModalVisible(false), 1)}
        onConfirm={handleIngredientDelete}
        onConfirmParam={deletedIndex}
        message={isDeleteIngredientModalVisible
          ? "Are you sure you want to delete item '" + ingredients[deletedIndex].item + "'?"
          : ""
        }
      />
      <PromptModal
        modalType="delete"
        isVisible={isDeleteStepModalVisible}
        closeModal={() => setTimeout(() => setDeleteStepModalVisible(false), 1)}
        onConfirm={handleStepDelete}
        onConfirmParam={deletedIndex}
        message={isDeleteStepModalVisible
          ? "Are you sure you want to delete Step " + (deletedIndex + 1) + "?"
          : ""
        }
      />
      <Grid container direction="row"
        style={{display:'flex', margin:'15px 10px 5px 10px', width:'initial'}}
      >
        <Grid item style={{
          width: focusedContainer !== "name" && isNameEmpty && isErrored ? '65%' : '100%',
          paddingRight: focusedContainer !== "name" && isNameEmpty && isErrored ? '7px' : '0'
        }}>
          <TextField
            InputProps={{
              classes: {
                input: classes.inputText
              },
              onBlur: () => {
                setGlobalDiff();
                setFocus(null);
              }
            }}
            classes={{
              root: focusedContainer === "name"
                ? classes.yellowRoot
                : isNameEmpty && isErrored
                  ? classes.redRoot
                  : classes.whiteRoot
            }}
            style={{
              opacity: containersDisabled ? '0.3' : '1.0',
              fontStyle: name === originalName || focusedContainer === "name" ? 'normal' : 'italic'
            }}
            required
            fullWidth
            disabled={containersDisabled}
            variant="outlined"
            label="Name"
            type="name"
            value={name}
            onClick={e => {
              e.stopPropagation();
              if (!containersDisabled) setFocus("name");
            }}
            onChange={e => setName(e.target.value)}
          />
        </Grid>
        {focusedContainer !== "name" && isNameEmpty && isErrored &&
          <Grid item
            style={{
              ...errorMessageStyle,
              paddingLeft:'3px',
              opacity: containersDisabled ? '0.3' : '1.0'
            }}
          >
            Please enter a name
          </Grid>
        }
      </Grid>
      <Grid container direction="row">
        <Grid item style={{
          width: focusedContainer !== "image" && isImageEmpty && isErrored ? '65%' : '100%'
        }}>
          <Collapse
            in={focusedContainer === "image"}
            classes={{wrapper: classes.wrapper}}
            style={borderStyle(
              focusedContainer,
              "image",
              containersDisabled && focusedContainer !== "image",
              isImageEmpty && isErrored
            )}
            collapsedHeight={50}
            onClick={e => {
              if (!(containersDisabled && focusedContainer !== "image")) {
                e.stopPropagation();
                setFocus("image");
              }
            }}
          >
            <Grid
              container
              direction="column"
              style={{opacity: containersDisabled && focusedContainer !== "image" ? '0.3' : '1.0'}}
            >
              <Grid item style={{...fullWidth, padding:'10px 10px 5px 10px'}}>
                <Typography
                  style={{
                    ...sectionTitleStyle(focusedContainer, "image"),
                    fontStyle: image === originalImage ? 'normal' : 'italic'
                  }}
                >
                  Image*
                </Typography>
                <div style={rightSideActionStyle}>
                  {focusedContainer === "image"
                  ? !!image && <Fab
                      style={iconButtonStyle}
                      onClick={e => {
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget)
                      }}
                    >
                      <MenuRoundedIcon
                        style={{
                          ...iconStyle,
                          background: !!anchorEl ? '#292929' : 'none'
                        }}
                      />
                    </Fab>
                  : <Fab
                      style={iconButtonStyle}
                      onClick={e => {
                        if (!(containersDisabled && focusedContainer !== "image")) {
                          e.stopPropagation();
                          setFocus("image");
                        }
                      }}
                    >
                      <ExpandMoreIcon />
                    </Fab>
                  }
                </div>
              </Grid>
            </Grid>
            <Card style={{padding:'0 10px', width:'99%', marginLeft:'0.5%'}}>
              {!!image
              ? <CardMedia
                  image={image}
                  style={{
                    height: !!image
                      ? isMobile ? '320px' : '280px'
                      : 'initial',
                    padding:'0',
                    borderRadius:'10px 10px 0 0'
                  }}
                />
              : <div style={{paddingBottom:'10px'}}>
                  <Button className="fileContainer" style={roundedButtonStyle}>
                    Upload Photo
                    <FileBase type="file" onDone={onImageChange}/>
                  </Button>
                  <Button style={roundedButtonStyle} onClick={() => setIconsModalVisible(true)}>
                    Choose Icon
                  </Button>
                </div>
              }
            </Card>
          </Collapse>
        </Grid>
        {focusedContainer !== "image" && isImageEmpty && isErrored &&
          <Grid item
            style={{
              ...errorMessageStyle,
              opacity: containersDisabled ? '0.3' : '1.0'
            }}
          >
            Please choose an image
          </Grid>
        }
      </Grid>
      <Grid container direction="row">
        <Grid item style={{
          width: focusedContainer !== "ingredients" && isIngredientsEmpty && isErrored ? '65%' : '100%'
        }}>
          <Collapse
            in={focusedContainer === "ingredients"}
            classes={{wrapper: classes.wrapper}}
            style={borderStyle(
              focusedContainer,
              "ingredients",
              containersDisabled && focusedContainer !== "ingredients",
              isIngredientsEmpty && isErrored
            )}
            collapsedHeight={50}
            onClick={e => {
              if (!(containersDisabled && focusedContainer !== "ingredients")) {
                e.stopPropagation();
                setFocus("ingredients");
              }
            }}
          >
            <Grid
              container
              direction="column"
              style={{opacity: containersDisabled && focusedContainer !== "ingredients" ? '0.3' : '1.0'}}
            >
              <Grid item style={{...fullWidth, padding:'10px'}}>
                <Typography
                  style={{
                    ...sectionTitleStyle(focusedContainer, "ingredients"),
                    fontStyle: ingredientsAreDifferent() ? 'italic' : 'normal'
                  }}
                >
                  Ingredients*
                </Typography>
                <div style={rightSideActionStyle}>
                  {focusedContainer === "ingredients"
                  ? <Button
                      startIcon={<AddIcon/>}
                      style={{
                        ...addButtonStyle,
                        opacity: addIngredientMode || editIngredientMode ? '0.3' : '1.0'
                      }}
                      disabled={addIngredientMode || editIngredientMode}
                      onClick={() => {
                        document.getElementById("ingredients").scroll({ top: 0, behavior: 'smooth' });
                        toggleAddIngredientMode();
                      }}
                      className={classes.button}
                    >
                      Add
                    </Button>
                  : <Fab
                      style={iconButtonStyle}
                      onClick={e => {
                        if (!(containersDisabled && focusedContainer !== "ingredients")) {
                          e.stopPropagation();
                          setFocus("ingredients");
                        }
                      }}
                    >
                      <ExpandMoreIcon />
                    </Fab>
                  }
                </div>
              </Grid>
              <Grid item id="ingredients"
                style={{
                  ...fullWidth,
                  maxHeight: isMobile ? '320px' : '280px',
                  width: '99%',
                  marginLeft: '0.5%',
                  overflow:'auto'
                }}>
                <IngredientsTable
                  tableRef={tableRef}
                  ingredients={ingredients}
                  isEditable={true}
                  editRowMode={editIngredientMode}
                  addRowMode={addIngredientMode}
                  toggleEditRowMode={toggleEditIngredientMode}
                  toggleAddRowMode={toggleAddIngredientMode}
                  onIngredientChange={handleIngredientChange}
                  onIngredientAdd={handleIngredientAdd}
                  onIngredientDelete={i => {
                    setDeletedIndex(i);
                    setDeleteIngredientModalVisible(true);
                  }}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
        {focusedContainer !== "ingredients" && isIngredientsEmpty && isErrored &&
          <Grid item
            style={{
              ...errorMessageStyle,
              opacity: containersDisabled ? '0.3' : '1.0'
            }}
          >
            Please enter at least one ingredient
          </Grid>
        }
      </Grid>
      <Grid container direction="row">
        <Grid item style={{
          width: focusedContainer !== "directions" && isDirectionsEmpty && isErrored ? '65%' : '100%'
        }}>
          <Collapse
            in={focusedContainer === "directions"}
            classes={{wrapper: classes.wrapper}}
            style={borderStyle(
              focusedContainer,
              "directions",
              containersDisabled && focusedContainer !== "directions",
              isDirectionsEmpty && isErrored
            )}
            collapsedHeight={50}
            onClick={e => {
              if (!(containersDisabled && focusedContainer !== "directions")) {
                e.stopPropagation();
                setFocusedContainer("directions");
              }
            }}
          >
            <Grid
              container
              direction="column"
              style={{opacity: containersDisabled &&
                (focusedContainer !== "image" && focusedContainer !== "directions") ? '0.3' : '1.0'
              }}
            >
              <Grid item style={{...fullWidth, padding:'10px'}}>
                <Typography
                  style={{
                    ...sectionTitleStyle(focusedContainer, "directions"),
                    fontStyle: directionsAreDifferent() ? 'italic' : 'normal'
                  }}
                >
                  Directions*
                </Typography>
                <div style={rightSideActionStyle}>
                  {focusedContainer === "directions"
                  ? <FormControl component="fieldset">
                      <RadioGroup
                        value={directionsType === "string" ? "paragraph" : "step-by-step"}
                        onChange={e => {
                          if (directionsType === "object" &&
                            directionSteps.length &&
                            !directionSteps[directionSteps.length - 1].length
                          ) {
                            handleStepDelete(directionSteps.length - 1);
                          }
                          const newType = e.target.value === "paragraph" ? "string" : "object";
                          setDirectionsType(newType);
                          setGlobalDiff(undefined, undefined, undefined, newType, undefined, undefined);
                        }}
                      >
                        <FormControlLabel
                          value="step-by-step"
                          control={<Radio color="primary" />}
                          label="Step-by-Step"
                          style={radioLabelStyle(directionsType, "object")}
                        />
                        <FormControlLabel
                          value="paragraph"
                          control={<Radio color="primary" />}
                          label="Paragraph"
                          style={radioLabelStyle(directionsType, "string")}
                        />
                      </RadioGroup>
                    </FormControl>
                  : <Fab
                      style={iconButtonStyle}
                      onClick={e => {
                        if (!(containersDisabled && focusedContainer !== "directions")) {
                          e.stopPropagation();
                          setFocusedContainer("directions");
                        }
                      }}
                    >
                      <ExpandMoreIcon />
                    </Fab>
                  }
                </div>
              </Grid>
              <Grid item style={fullWidth}>
                <ThemeProvider theme={createMuiTheme(inputTheme)}>
                  {directionsType === "string"
                  ? <TextField
                      InputProps={{
                        classes: {
                          root: classes.multilineTextField,
                          input: classes.multilineInputText
                        },
                        onBlur: () => setGlobalDiff()
                      }}
                      style={{width:'95%', margin:'0 2.5% 10px 2.5%'}}
                      variant="outlined"
                      color="secondary"
                      multiline
                      rowsMax={10}
                      value={directionsParagraph}
                      onChange={e => setDirectionsParagraph(e.target.value)}
                    />
                  : <div style={{
                      maxHeight:'280px',
                      overflow:'auto',
                      padding:'0 0 10px 5px'
                    }}>
                      <Grid container direction="column">
                        {directionSteps.map((step, index) => {
                        return (
                          <Grid container direction="row" key={index}>
                            <Grid item style={{width:'8%', paddingTop: '7px'}}>
                              <Fab style={iconButtonStyle}>
                                <DeleteOutlineIcon
                                  onClick={e => {
                                    e.stopPropagation();
                                    setDeletedIndex(index);
                                    setDeleteStepModalVisible(true);
                                  }}
                                />
                              </Fab>
                            </Grid>
                            <Grid item style={{width:'8%', paddingTop: '13px'}}>
                              <Typography style={{
                                float: 'right',
                                paddingRight: '5px',
                                fontSize: '16px'
                              }}>
                                {index + 1 + "."}
                              </Typography>
                            </Grid>
                            <Grid item style={{width:'80%', padding: '5px 0 5px 15px'}}>
                              <TextField
                                InputProps={{
                                  classes: {
                                    input: classes.inputTextReducedPadding
                                  },
                                  onFocus: () => setFocusedStep(index),
                                  onBlur: () => {
                                    setFocusedStep(null);
                                    setAddStepMode(false);
                                  }
                                }}
                                id={"step_" + index}
                                variant="outlined"
                                color="secondary"
                                style={fullWidth}
                                autoFocus={addStepMode}
                                error={!step.length}
                                helperText={step.length || focusedStep === index ? "" : "This step is empty"}
                                value={step}
                                onChange={e => {
                                  let currentSteps = [...directionSteps];
                                  currentSteps[index] = e.target.value;
                                  setDirectionSteps(currentSteps);
                                  setGlobalDiff(undefined, undefined, undefined, undefined, undefined, currentSteps);
                                }}
                              />
                            </Grid>
                          </Grid>
                        )})}
                        <Grid container direction="row">
                          <Grid item style={{width:'16%'}}>
                            <Fab style={iconButtonStyle}
                              disabled={directionSteps.length && !directionSteps[directionSteps.length - 1].length}
                              onClick={() => {
                                setDirectionSteps([...directionSteps, ""]);
                                setAddStepMode(true);
                              }}
                            >
                              <AddIcon/>
                            </Fab>
                          </Grid>
                          <Grid item style={{
                            width: '75%',
                            cursor: 'pointer',
                            margin: '7px 0 7px 15px',
                            fontSize: '16px',
                            color: '#b5b5b5'
                          }} onClick={() => {
                            if (!directionSteps.length || directionSteps[directionSteps.length - 1].length) {
                              setDirectionSteps([...directionSteps, ""]);
                              setAddStepMode(true);
                            }
                          }}>
                            Add step...
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  }
                </ThemeProvider>
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
        {focusedContainer !== "directions" && isDirectionsEmpty && isErrored &&
          <Grid item
            style={{
              ...errorMessageStyle,
              opacity: containersDisabled ? '0.3' : '1.0'
            }}
          >
            Please enter at least one direction
          </Grid>
        }
      </Grid>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={e => {
          e.stopPropagation();
          setAnchorEl(null)
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.paper
        }}
      >
        <Grid container direction="column">
          <Grid item style={{background:'#292929', borderBottom: '1px solid white', padding:'10px'}}>
            <label className="fileContainer" style={{fontSize:'16px'}} onClick={e => e.stopPropagation()}>
              Upload Photo
              <FileBase type="file" onDone={onImageChange}/>
            </label>
          </Grid>
          <Grid item style={{background:'#292929'}}>
            <Button
              className={classes.button}
              style={{fontSize: '16px', width:'100%', fontFamily: 'Signika'}}
              onClick={e => {
                e.stopPropagation();
                setIconsModalVisible(true);
              }}
            >
              Choose icon
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </div>
    </ClickAwayListener>
  );
}

export default RecipeForms;