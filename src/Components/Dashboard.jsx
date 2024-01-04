import React, { useEffect, useLayoutEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const [isAdmin,setIsAdmin] = useState(false);
    const user = localStorage.getItem("userLogged")
    const currentUser = JSON.parse(user)

    useEffect(()=>{
      if(!localStorage.getItem("userLogged"))
        navigate("/login")
      fetchUsers()
      checkAdmin()
    },[isAdmin])

    const fetchUsers = async() =>{
      try{
        const response = await fetch('http://192.168.51.7:5000/v1/users')
        const result = await response.json();
        setUsers(result)
        console.log("data from backend",users)
      }catch(error){
        console.log("Can't fetch Users:", error)
      }
    }

    const checkAdmin = async() =>{
      console.log(currentUser.email)
      try{
        const response = await fetch('http://192.168.51.7:5000/v1/check-admin',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({'email':currentUser.email})
        })
        const result = await response.json();
        setIsAdmin(result.found)
      }catch(error){
        console.log("Can't recognize the User:",error)
      }
    }

    return (
      <div>
        <Navbar/>
        <div className='pt-[100px] flex justify-center'>
          {
            isAdmin ? <h1>Hello Admin, Click on the Gallary to explore !!</h1>
            : <h1>Hello User, Click on the Gallary to explore.</h1>
          }
        </div>
      </div>
    );
}

export default Dashboard



