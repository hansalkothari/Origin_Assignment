import React from "react";
import Navbar from "./Navbar";
import { Grid } from "@mui/material";
import { Card, CardContent, CardMedia, Box } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { useNavigate } from "react-router-dom";
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination'; 


const Gallary = () => {
  const navigate = useNavigate()
  const [imageUrls, setimageUrls] = useState([]);
  const [fixedImages, setfixedImages] = useState([]);
  const [labels,setLabels] = useState([])
  const [filterLabels, setFilterLabels] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [isAdmin,setIsAdmin] = useState(false);
  
  const user = localStorage.getItem('userLogged')
  const currentUser = JSON.parse(user).email
  
  const [open,setOpen] = useState(false)
  const [imageIndex, setImageIndex] = useState(null)
  const [label, setLabel] = useState("")

  const [page,setPage] = useState(1)
  const cardsPerPage = 8;
  const startIndex = cardsPerPage*(page-1)
  const endIndex = startIndex + cardsPerPage
  const imagesVisible = imageUrls.slice(startIndex,endIndex)

  useEffect(() => {
    if(!localStorage.getItem("userLogged"))
        navigate("/login")
    fetchImages();
    getLabels();
    isLoggedInUserAdmin();
    
  }, []);

  const handlePageChange = (event,value) =>{
    setPage(value)
  }

  const getLabels = async() =>{
    try {
      const response = await fetch("http://192.168.51.7:5000/v1/get-labels");
      const result = await response.json();
      setLabels(result.labels);
      console.log("saved labels:",labels);
    } catch (error) {}
  }

  const fetchImages = async () => {
    try {
      const response = await fetch("http://192.168.51.7:5000/v1/get-images");
      const result = await response.json();
      setimageUrls(result.imageUrls);
    } catch (error) {}
  };

  const handleFilterLabel = (event) => {
    setFilterLabels(event.target.value);
  };

  const handleSort = () => {
    setSortAsc(!sortAsc);
    if (sortAsc) {
      imageUrls.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        } else return 1;
      });
    } else {
      imageUrls.sort((a, b) => {
        if (a.label < b.label) {
          return 1;
        } else return -1;
      });
    }
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

  const deleteImage = (index) => {
    const updatedImages = [...imageUrls]
    updatedImages.splice(index,1)
    setimageUrls(updatedImages)
  }

  const handleChipDelete = (index,ind) =>{
    const updatedImages = [...imageUrls]
    console.log("indexes are:",index, ind)
    updatedImages[index].tags.splice(ind,1)
    setimageUrls(updatedImages)
  }

  const handleOpen = (index) =>{
    console.log("opening dialog")
    setImageIndex(index)
    setOpen(true)
  }

  const handleClose = () =>{
    setOpen(false)
  }

  const handleLabelChange = (event) =>{
    setLabel(event.target.value)
  }

  const handleSave = async() =>{
    imageUrls[imageIndex].tags.push(label)
    //add label via API call.
    try{
      const idx = imageUrls[imageIndex].id
      const tag = label;
      const response = await fetch("http://192.168.51.7:5000/v1/add-label",{
        headers:{
          'Content-Type':'application/json'
        },
        method:"POST",
        body:JSON.stringify({'id':idx, 'tag':tag})
      })
      const result = await response.json()
      console.log(result.message)
    }catch(error){}
    setLabel("")
    setOpen(false)
    setImageIndex(null)
  }
  
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Navbar />

      <div className="px-8 pt-[80px] w-full flex justify-center">
        <Autocomplete
          className="flex-1"
          freeSolo
          id="search-by-label"
          disableClearable
          options={imageUrls.map((option) => option.label)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search input"
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
              onChange={handleFilterLabel}
            />
          )}
        />
        <Button
          endIcon={sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          variant="outlined"
          onClick={() => {
            handleSort();
          }}
        >
          Sort
        </Button>
      </div>

      <div
        style={{ height: "100%" }}
        className="px-8 mt-4 flex flex-col flex-1"
      >
        <Grid sx={{ flexGrow: 1 }} columns={4} container spacing={4}>
          {filterLabels == ""
            ? imagesVisible.map((item, index) => (
                <Grid
                  sx={{ alignItems: "center", justifyContent: "center" }}
                  key={index}
                  item
                  xs={1}
                >
                  <div className="flex justify-center">
                    <Card sx={{ width: "100" }}>
                      <CardMedia
                        sx={{ height: "300px", objectFit: "contain" }}
                        component="img"
                        alt="a cat"
                        image={item.url}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.label}
                        </Typography>
                        <Paper
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            listStyle: "none",
                            p: 0.5,
                            m: 0,
                            overflow: "auto",
                          }}
                        >
                          {item.tags &&
                            item.tags.map((tag, ind) => (
                              <Chip
                                key={ind}
                                variant="outlined"
                                label={tag}
                                onDelete={() => handleChipDelete(index, ind)}
                              ></Chip>
                            ))}
                        </Paper>
                        <div className="py-4 flex justify-between">
                          <div>
                            <Button
                              variant="outlined"
                              color="primary"
                              endIcon={<ChangeCircleIcon />}
                              onClick={() => handleOpen(index)}
                            >
                              Add a Label
                            </Button>
                          </div>
                          <div>
                            {isAdmin === true ? (
                              <Button
                                variant="outlined"
                                endIcon={<DeleteIcon />}
                                sx={{ color: "red", alignItems: "center" }}
                                onClick={() => deleteImage(index)}
                              >
                                Delete
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                disabled
                                endIcon={<DeleteIcon />}
                                sx={{ color: "red", alignItems: "center" }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Grid>
              ))
            : imageUrls.map(
                (item, index) =>
                  item.tags.some((tag) =>
                    tag.toLowerCase().includes(filterLabels.toLowerCase())
                  ) &&
                  item.url && (
                    <Grid
                      sx={{ alignItems: "center", justifyContent: "center" }}
                      key={index}
                      item
                      xs={1}
                    >
                      <div className="flex justify-center">
                        <Card sx={{ width: "100" }}>
                          <CardMedia
                            sx={{ height: "300px", objectFit: "contain" }}
                            component="img"
                            image={imageUrls[index].url}
                            alt="Cat"
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {item.label}
                            </Typography>
                            <Paper
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                listStyle: "none",
                                p: 0.5,
                                m: 0,
                                overflow: "auto",
                              }}
                            >
                              {imageUrls[index].tags &&
                                imageUrls[index].tags.map((tag, ind) => (
                                  <Chip
                                    key={ind}
                                    variant="outlined"
                                    label={tag}
                                    onDelete={() =>
                                      handleChipDelete(index, ind)
                                    }
                                  ></Chip>
                                ))}
                            </Paper>
                            <div className="py-4 flex justify-between">
                              <div>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  endIcon={<ChangeCircleIcon />}
                                  onClick={() => handleOpen(index)}
                                >
                                  Add a Label
                                </Button>
                              </div>
                              <div>
                                {isAdmin === true ? (
                                  <Button
                                    variant="outlined"
                                    endIcon={<DeleteIcon />}
                                    sx={{ color: "red", alignItems: "center" }}
                                    onClick={() => deleteImage(index)}
                                  >
                                    Delete
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outlined"
                                    disabled
                                    endIcon={<DeleteIcon />}
                                    sx={{ color: "red", alignItems: "center" }}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </Grid>
                  )
              )}
        </Grid>
        {filterLabels === "" && imagesVisible.length > 0 && (
          <Pagination
            variant="outlined"
            shape="rounded"
            color="primary"
            size="large"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "auto",
            }}
            count={Math.ceil(imageUrls.length / cardsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="tag"
            label="select a label"
            type="text"
            fullWidth
            variant="outlined"
            value={label}
            onChange={handleLabelChange}
            select
          >
            {labels.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "red" }}
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant="outlined" onClick={() => handleSave(imageIndex)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Gallary;
