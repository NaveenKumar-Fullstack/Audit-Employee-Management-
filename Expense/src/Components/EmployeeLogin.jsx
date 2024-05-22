import { useState } from "react"

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../base_url";

function EmployeeLogin() {
    const [values,setValues]=useState({
        email:'',
        password:''
    });
    const [error,setError] = useState(null);
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const handlesubmit = (event)=>{
        event.preventDefault()
        axios.post(`${baseUrl}/employee/employee_login`,values)
        .then(result => {
          if(result.data.loginStatus){
            localStorage.setItem('valid',true);
            navigate('/employee_detail/'+result.data.id)
            console.log(result.data.id);
          }else{
            setError(result.data.Error)
          }
         
        })
        .catch(err => console.log(err))
        
    
    }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginpage bg-primary">
    <div className="p-3 rounded-3  border loginForm bg-secondary">
      <div className="text-danger">
         {error && error}
      </div>
        <h1>Login Page Employee</h1>
        <form onSubmit={handlesubmit}>
            <div className="mb-3">
          <label htmlFor="email"><strong>Email:</strong></label>
          <input type="email" name="email" autoComplete="off" placeholder="Enter Email" className="form-control rounded-0" onChange={(e)=>setValues({...values,email:e.target.value})}/>
            </div>
            <div className="mb-3">
                <label htmlFor="password"><strong>Password:</strong></label>
                <input type="password" name="password" autoComplete="off" placeholder="Enter Password" className="form-control rounded-0" onChange={(e)=>setValues({...values,password:e.target.value})}/>
            </div>
            <button type='submit' className="btn btn-success w-100 rounded-0 mb-1">Submit</button>
            <div className="mb-2">
                <input type="checkbox" name="tick" id="tick" className="me-2" />
                <label>You are Agree with terms and condition</label>
            </div>
        </form>
    </div>
</div>
  )
}

export default EmployeeLogin