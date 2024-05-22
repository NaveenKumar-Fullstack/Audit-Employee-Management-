import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../base_url';

function Start() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${baseUrl}/verify`)
      .then(result => {
        if (result.data.Status) {
          if (result.data.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/employee_detail/' + result.data.id);
          }
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-3 rounded w-25 border bg-secondary">
        <h2 className="text-center">Login As</h2>
        <div className="d-flex flex-column mt-5">
          <button
            onClick={() => navigate('/employee_login')}
            className="btn btn-primary mb-3"
          >
            Employee
          </button>
          <button
            onClick={() => navigate('/adminlogin')}
            className="btn btn-danger mb-3"
          >
            Admin
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-success"
          >
            Register Employee
          </button>
        </div>
      </div>
    </div>
  );
}

export default Start;
