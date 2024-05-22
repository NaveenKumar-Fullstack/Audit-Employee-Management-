import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../base_url';

function AddEmployee() {
        
    const [employee,setEmployee] =useState({
        name:'',
        email: '',
        password: '',
        address: '',
        image: '',
    })
const navigate = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('name',employee.name);
        formData.append('email',employee.email);
        formData.append('password',employee.password);
        formData.append('address',employee.address);
        formData.append('image',employee.image);

        axios.post(`${baseUrl}/auth/add_employee`,formData)
        .then(result =>{
            if(result.data.Status){
                navigate('/dashboard/employee')
            }else{
                alert(result.data.Error)
            }
        })
        .catch(err =>console.log(err))
    }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
        <div className="p-3 rounded w-50 border">
            <h3 className="text-center">Add Employee</h3>
            <form className="row g-1" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="inputName" className="form-label">Name</label>
                    <input type='text' className="form-control rounded-0" id="inputName" placeholder="Enter Name"
                    onChange={(e)=>setEmployee({...employee, name: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input type='email' className="form-control rounded-0" id="inputEmail4" placeholder="Enter Email" autoComplete="off"
                    onChange={(e)=>setEmployee({...employee,email: e.target.value})}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputPassword4" className="form-label">Password</label>
                    <input type='password' className="form-control rounded-0" id="inputPassword4" placeholder="Enter Password"
                    onChange={(e)=>setEmployee({...employee, password: e.target.value})}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputAddress4" className="form-label">Address</label>
                    <input type='text' className="form-control rounded-0" id="inputAddress4" placeholder="Enter Address"
                    onChange={(e)=>setEmployee({...employee, address: e.target.value})}
                    />
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="inputGroup01" className="form-label">Select Image</label>
                    <input type='file' className="form-control rounded-0" id="inputGroup01" 
                    onChange={(e)=>setEmployee({...employee, image: e.target.files[0]})}
                    name='image'
                    />
                </div>
                <button className="btn btn-success w-100" type="submit">Add Employee</button>
            </form>
        </div>

    </div>
  )
}

export default AddEmployee;