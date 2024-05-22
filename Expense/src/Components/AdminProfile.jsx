import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { baseUrl } from "../base_url"

const AdminProfile = () => {
    const [profile,setProfile]= useState([])
    const {id} = useParams()
    useEffect(()=>{
        axios.get(`${baseUrl}/auth/profile/`+id)
        .then(result => {
            setProfile(result.data[0])
        })
        .catch(err => console.error(err))
    }, []);
  return (
    <div className="container mt-5">
    <div className="card">
      <div className="card-body">
        <h4 className="card-title d-flex justify-content-center mb-4 p-2">Admin Profile</h4><hr/>
        {/* <div className="d-flex align-items-center">
          <img src={`http://localhost:3000/images/${profile.image}`}  className="rounded-circle me-3 p-1" 
              style={{ width: "150px", height: "150px" }} alt="Employee" />
          <div className="p-2 ms-2"> */}
            {/* <h3 className="mb-1">Name: {profile.name}</h3> */}
            <h3 className="mb-1">Email: {profile.email}</h3>
            {/* <h3 className="mb-3">Address: {profile.address}</h3> */}
          </div>  
        </div> 
      </div>
    
  )
}

export default AdminProfile