import { useEffect, useState } from "react"
import axios from "axios";
import { baseUrl } from "../base_url";
const Home = () => {
  const [adminTotal,setAdminTotal] = useState()
  const [employeeTotal,setEmployeeTotal] = useState()
  const [totalList,setTotalList]= useState();
  const [adminrecord,setAdminRecord] = useState([]);

  useEffect(()=>{
   adminCount();
   employeeCount();
   ListCount();
   AdminRecords();

  })

  const adminCount = ()=>{
    axios.get(`${baseUrl}/auth/admin_count`)
   .then(result =>{
    if(result.data.Status){
      setAdminTotal(result.data.Result[0].admin)
    }
   })
  }

  const employeeCount = ()=>{
    axios.get(`${baseUrl}/auth/employee_count`)
   .then(result =>{
    if(result.data.Status){
      setEmployeeTotal(result.data.Result[0].employee)
    }
   })
  }

  const AdminRecords = ()=>{
    axios.get(`${baseUrl}/auth/admin_records`)
   .then(result =>{
    if(result.data.Status){
      setAdminRecord(result.data.Result)
    }
   })
  }

  const ListCount = ()=>{
    axios.get(`${baseUrl}/auth/list_count`)
   .then(result =>{
    if(result.data.Status){
      setTotalList(result.data.Result[0].list)
    }
   })
  }

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr/>
          <div className="d-flex justify-content-between">
            <h5>Total</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr/>
          <div className="d-flex justify-content-between">
            <h5>Total</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Ex.List</h4>
          </div>
          <hr/>
          <div className="d-flex justify-content-between">
            <h5>Total</h5>
            <h5>{totalList}</h5>
          </div>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {adminrecord && adminrecord.length > 0 ? (
    adminrecord.map((a, index) => (
      <tr key={index}>
        <td>{a.email}</td>
        <button className="btn btn-info btn-sm me-2">Edit</button>
        <button className="btn btn-warning btn-sm">Delete</button>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="1">No records found</td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  )
}

export default Home