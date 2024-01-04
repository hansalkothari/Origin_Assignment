import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';

import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

const LabelCreator = () => {
  const navigate = useNavigate()
  const [label, setLabel] = useState("")
  const [labels, setLabels] = useState([])
  const [isAdmin,setIsAdmin] = useState(false);
  const user = localStorage.getItem('userLogged')
  const currentUser = JSON.parse(user).email
  
  useEffect(()=>{
    if(!localStorage.getItem("userLogged"))
        navigate("/login")
    isLoggedInUserAdmin();
    getLabels();
  },[label])

  const assignLabel = (event) =>{
    setLabel(event.target.value)
  }

  const saveLabel = async () => {
    try {
      const response = await fetch("http://192.168.51.7:5000/v1/save-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label: label }),
      });
      const result = await response.json();
      console.log("current labels available", result.labels);
      setLabel("")
    } catch (error) {}
  };

  const isLoggedInUserAdmin = async() =>{
    try{
      const response = await fetch("http://192.168.51.7:5000/v1/check-admin",{
        headers:{
          'Content-Type':'application/json',
        },
        method:'POST',
        body:JSON.stringify({'email':currentUser})
      })
      const result = await response.json();
      setIsAdmin(result.found)
    }catch(error){

    }
  }

  const handleChipDelete = async(ind) =>{
    try{
      const newTags = [...labels]
      newTags.splice(ind,1)
      console.log(newTags)
      setLabels(newTags)

      const response = await fetch("http://192.168.51.7:5000/v1/set-labels",{
        headers:{
          'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({'labels':newTags})
      })
      const result = await response.json();
      console.log("new tags are", result.labels)
      
    }catch(error){

    }
  }

  const getLabels = async() => {
    try{
      const response = await fetch('http://192.168.51.7:5000/v1/get-labels')
      const result = await response.json();
      if(result.labels){
        setLabels(result.labels)
      }
    }catch(error){
      
    }
    
  }
  
  return (
    <>
        <Navbar></Navbar>
        <div className='pt-[90px] flex justify-center'>
            <Paper sx={{marginTop:'20px' ,padding:'20px' ,display: 'flex', flexDirection:'column', justifyContent:'center' ,flexWrap: 'wrap', listStyle: 'none', overflow:'auto', width:'50%' }}>
              <h1 className='items-center flex justify-center'>Manage Labels</h1>
              <br />
              <div>
              { 
                labels.map((tag,ind)=>(
                        <Chip key={ind} variant="outlined" label={tag} onDelete={() => handleChipDelete(ind)} ></Chip>
                ))
              }
              </div>
            </Paper>
        </div>
        <div className='px-8 pt-2 flex justify-center'>
          <TextField id="label" label="Create a label" variant="outlined" value={label} onChange={assignLabel}/>
          {
            isAdmin ? <Button variant='outlined' onClick={saveLabel} endIcon={<AddTaskIcon/>}>Save</Button>
            :
            <Button disabled variant='outlined'  onClick={saveLabel} endIcon={<AddTaskIcon/>}>Save</Button>
          }
          
        </div>
        <Outlet></Outlet>
    </>
    
  )
}

export default LabelCreator