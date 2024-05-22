import axios from "axios"
import { useEffect, useState } from "react"
import { Link, Outlet, useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../base_url"

function EmployeeDetail() {
    const [employees,setEmployees]= useState([])
    const {id} = useParams()
    useEffect(()=>{
        axios.get(`${baseUrl}/employee/detail/`+id)
        .then(result => {
            setEmployees(result.data[0])
        })
        .catch(err => console.error(err))
    }, []);
    const navigate = useNavigate();
    axios.defaults.withCredentials=true;
    const handleLogout = () => {
      axios.get(`${baseUrl}/employee/logout`)
      .then(result =>{
        if(result.data.Status){
          localStorage.removeItem('valid')
          navigate('/')
        }
      }).catch(err =>console.error(err));
    }

  return (
    <div className="container mt-5">
    <div className="card">
      <div className="card-body">
        <h4 className="card-title d-flex justify-content-center mb-4 p-2">Employee Details</h4><hr/>
        <div className="d-flex align-items-center">
          <img src={`${baseUrl}/images/${employees.image}`}  className="rounded-circle me-3 p-1" 
              style={{ width: "150px", height: "150px" }} alt="Employee" />
          <div className="p-2 ms-2">
            <h3 className="mb-1">Name: {employees.name}</h3>
            <h3 className="mb-1">Email: {employees.email}</h3>
            <h3 className="mb-3">Address: {employees.address}</h3>
          </div>  
        </div> 
      </div>
    </div>
    <div className="d-flex justify-content-center mt-4">
    <button className="btn btn-danger me-2" onClick={handleLogout}>Logout</button>
    <Link to="./add_liste" relative="path" className="btn btn-info me-2">Fill Expense Details</Link>
    <Link to="./see_liste" relative="path" className="btn btn-info me-2">See All </Link>
    
    </div>
    <div className="mt-5 container p-2"><Outlet/></div>
  </div>
  )
}

export default EmployeeDetail