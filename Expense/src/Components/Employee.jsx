import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './Employee.css'
import { baseUrl } from "../base_url";

function Employee() {
  const [employee,setEmployee] = useState([])

  useEffect(()=>{
    axios.get(`${baseUrl}/auth/employee`)
    .then(result => {
      if (result.data.Status) {
        setEmployee(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    })
    .catch(err => console.log(err));
  },[]);

const handleDelete = (id) =>{
axios.delete(`${baseUrl}/auth/delete_employee/${id}`)
.then(result =>{
  if(result.data.Status){
    window.location.reload();
  }else{
    alert(result.data.Error);
  }
})
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">Add Emplyee</Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>EmpID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Address</th>
              <th>image</th>
              
            </tr>
          </thead>
          <tbody>
            {employee.map((item, index) => (
              <tr key={index}>
                <td>{item.empid}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.password}</td>
                <td>{item.address}</td>
                <td><img src={`${baseUrl}/images/`+item.image} alt="" className="employee_image"/></td>
                <td>
                  <Link to={`/dashboard/edit_employee/`+item.empid} className="btn btn-info btn-sm me-2">Edit</Link>
                  <button onClick={()=>handleDelete(item.empid)}  className="btn btn-warning btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employee;