import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import UsersTable from '../tables/UsersTable';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'fixed',
    left: 0,
    marginTop: '15px',
    width: isMobile ? '90%' : '80%',
    marginLeft: isMobile ? '5%' : '11%',
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    margin: '8px 13px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    width: isMobile ? '100%' : '97%',
    outline: '1px solid white',
    background: '#202020',
    fontSize: '16px'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: '100%'
  }
}));

const SearchTab = props => {
  const classes = useStyles();
  const [searchVal, setSearchVal] = useState("");
  return (
    <div>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search users..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{'aria-label':'search'}}
          onChange={e => setSearchVal(e.target.value.toLowerCase())}
        />
      </div>
      <div style={{padding:'25px 0'}}/>
      <UsersTable
        users={
          props.usersArray.filter(user =>
            user.username.toLowerCase().includes(searchVal) ||
            user.firstName.toLowerCase().includes(searchVal) ||
            user.lastName.toLowerCase().includes(searchVal)
          )
        }
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    usersArray: Object.values(state.users)
  };
}

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchTab);