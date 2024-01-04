import React, { useLayoutEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import Auth0Lock from 'auth0-lock';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import './signin.css'

import { IconButton} from '@mui/material';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { useData } from '../Context/userContext';
import { NavigateBeforeTwoTone } from '@mui/icons-material';
//import { useLayoutEffect } from 'react';

const Signin = () => {

    const { user, loginWithPopup ,isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate()
    const { data, storeData, deleteData } = useData();

    
    useEffect(() =>{
      if(user){
        localStorage.setItem("userLogged", JSON.stringify(user))
        navigate('/dashboard')
      }
      if(localStorage.getItem("userLogged")){
        navigate('/dashboard')
      }
    },[user])

    
    return (
      <div className="bg-cover bg-center h-screen flex items-center justify-center custom-background">
      {
        (!isAuthenticated)?(
        <Button
          color='warning'
          sx={{color : 'white', height:'40px'}}
          variant="outlined"
          endIcon={<LoginIcon />}
          onClick={() => loginWithPopup()}
        >
          Login to Continue
        </Button>
        ):(
        <div>User Successfully logged In</div>)
      }
      </div>
    );
}

export default Signin