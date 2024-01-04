import React from 'react'
import {Button} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth0 } from '@auth0/auth0-react';
import {useState, useEffect, useLayoutEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { logout, user } = useAuth0();
  
  
  useEffect(() => {
  
  }, []);

  const userLogout = () => {
   
    localStorage.removeItem("userLogged")
    logout({ returnTo: window.location.origin })
  };

  
  
  return (
    <nav className="bg-gray-800 p-4 fixed top-0 w-full flex justify-between">
      
      <div className="text-white cursor-pointer flex">
        <MenuIcon/>
        <div className="text-white px-8"> 
          <Link className='px-4' to={'/dashboard/gallary'}>Gallary</Link>
          <Link className='px-4' to={'/dashboard/upload'} >Upload</Link>
          <Link className='px-4' to={'/dashboard/user-management'} >Create Labels</Link>
        </div>
      </div>

      <div className="text-white">
        <Button
          sx={{color:'white'}}
          aria-label="logout"
          variant="outlined"
          endIcon={<LogoutIcon />}
          onClick={userLogout}
          color='warning'
        >
          Logout
        </Button>
      </div>
    
    </nav>
  );
}

export default Navbar

/****************SEARCH BAR******************/
const SearchBar = () =>{
    return(
        <div>
            SEARCH BAR
        </div>
    )
} 