import './App.css';
import {Route, Routes,useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Signin from './Components/Signin';
import Dashboard from './Components/Dashboard';
import { DataProvider } from './Context/userContext';
import UploadImage from './Components/UploadImage';
import LabelCreator from './Components/LabelCreator';
import Gallary from './Components/Gallary';

import { useEffect } from 'react';


const Redirect = () =>{
  const navigate = useNavigate();
  useEffect(() =>{
    if(!localStorage.getItem("userLogged")){
        navigate("/login")
    }else{
        navigate('/dashboard')
    }
  },[])
}

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route exact path='/' element = {<Redirect/>}></Route>
        <Route exact path="/login" Component={Signin} />
        <Route exact path="/dashboard" Component={Dashboard}/>
        
        <Route exact path='dashboard/upload' Component={UploadImage} />
        <Route exact path='dashboard/user-management' Component={LabelCreator}/>
        <Route exact path='dashboard/gallary' Component={Gallary} />
        <Route exact path='*' element = {<Redirect/>}/>
      </Routes>
    </DataProvider>
  );
}

export default App;
