import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { Button } from '@mui/material'

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { forwardRef } from 'react';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UploadImage = () => {
  const navigate = useNavigate()
  const [url,setUrl] = useState("");
  const [label, setLabel] = useState("")
  const [fileOpen, setFileOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [snackBar, setSnackBar] = useState(false)
  const [imageDataUrl, setImageDataUrl] = useState(null);

  const [isAdmin,setIsAdmin] = useState(false);
  const user = localStorage.getItem('userLogged')
  const currentUser = JSON.parse(user).email

  useEffect(() =>{
    if(!localStorage.getItem("userLogged"))
        navigate("/login")
    const send_request = async() =>{
      try {
        const response = await fetch("http://192.168.51.7:5000/v1/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: imageDataUrl, label: label, tags:[] }),
        });
        const result = await response.json();
      } catch (error) {}
    }
    send_request()
    isLoggedInUserAdmin()
  },[imageDataUrl])

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
  
  const handleLabelChange = (event) =>{
    setLabel(event.target.value)
  }

  const upload = async() =>{
    try{
      const response = await fetch('http://192.168.51.7:5000/v1/upload',
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify({'url':url, 'label':label})
        }
      )
    }catch(error){

    }
  }

  const handleFileOpen = () =>{
    setFileOpen(true)
  }

  const handleFileClose = () =>{
    setFileOpen(false)
  }

  const handleFileUpload = async() =>{
    const formats = ['image/png', 'image/jpeg', 'image/jpg']
    if(selectedImage){
      if(formats.includes(selectedImage.type)){
        const reader = new FileReader();
          reader.onload = (e) => {
            const newImageDataUrl = e.target.result;
            setImageDataUrl(newImageDataUrl);
          };
          reader.readAsDataURL(selectedImage);
      }
      else{
        setSnackBar(true)
      }
    }
    
    setFileOpen(false)
    setImageDataUrl(null)
  }

  const handleFileChange = (event) =>{
    const file = event.target.files[0];
    setSelectedImage(file);
  }

  const handleSnackClose = (event, reason) =>{
    if(reason === 'clickaway')
      return 
    setSnackBar(false)
  }

  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center">
        
        { isAdmin ?
            <Button  variant="outlined" onClick={handleFileOpen}>
              Upload An Image From Computere
            </Button>
          :
            <Button disabled variant="outlined" onClick={handleFileOpen}>
              Upload An Image From Computere
            </Button>
        }
        
        <Dialog open={fileOpen} onClose={handleFileClose}>
          <DialogTitle>Upload From PC</DialogTitle>
          <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Category"
              type="text"
              fullWidth
              variant="outlined"
              value={label}
              onChange={handleLabelChange}
              required
            />
            <Button endIcon={<CloudUploadIcon />}>
              <input type="file" onChange={handleFileChange} required/>
            </Button>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ color: "red" }}
              variant="outlined"
              onClick={handleFileClose}
            >
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleFileUpload}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar
          open={snackBar}
          autoHideDuration={6000}
          onClose={handleSnackClose}
        >
          <Alert onClose={handleSnackClose} severity="error" sx={{ width: "100%" }}>
            Please upload file in jpg, jpeg or png format.
          </Alert>
        </Snackbar>
      </div>
      <Outlet></Outlet>
    </>
  );
}

export default UploadImage