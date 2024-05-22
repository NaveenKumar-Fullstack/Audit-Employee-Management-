
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../base_url';

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  useEffect(() => {
    axios.get(`${baseUrl}/auth/employee/${id}`)
      .then(response => {
        const { name, email, password, address } = response.data.Result[0];
        setEmployee({ name, email, password, address});
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      [name]: value
    }));
  };

  // const handleImageChange = e => {
  //   setEmployee(prevEmployee => ({
  //     ...prevEmployee,
  //     image: e.target.files[0]
  //   }));
  // };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('password', employee.password);
    formData.append('address', employee.address);
    

    try {
      const response = await axios.put(`${baseUrl}/auth/edit_employee/${id}`, formData);
      console.log('Employee edited successfully:', response.data);
      navigate('/dashboard/employee');
    } catch (error) {
      console.error('Error editing employee:', error);
    }
  };

  return (
    <div className="container">
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={employee.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={employee.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={employee.password} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" name="address" value={employee.address} onChange={handleChange} />
        </div>
        {/* <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" className="form-control" name="image" onChange={handleImageChange} />
        </div> */}
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default EditEmployee;
