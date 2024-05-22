import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faList, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';
import { baseUrl } from '../base_url';

function DashboardEmp() {
//   const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('http://localhost:3000/employee')
//       .then(result => {
//         if (result.data.Status) {
//           setEmployees(result.data.Result);
//         } else {
//           alert(result.data.Error);
//         }
//       })
//       .catch(err => console.log(err));
//   }, []);

  const handleLogout = () => {
    axios.get(`${baseUrl}/employee/logout`)
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem('valid');
          navigate('/');
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Link to='/dashboard_emp' className="logo d-flex justify-content-center">CWC</Link>
        <ul className="nav-menu">
          <li className="d-flex justify-content-center ">
            <Link to='/dashboard_emp' className="nav-link mt-5 mb-2 ms-2 fs-5">
              <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
              Dashboard
            </Link>
          </li>
          <li className="d-flex justify-content-center">
            <Link to='/dashboard/employee_detail/:id' className="nav-link mb-2 ms-0  fs-5">
              <FontAwesomeIcon icon={faUsers} className="icon" />
              Employee
            </Link>
          </li>
          <li className="d-flex justify-content-center ms-3">
            <Link to='/dashboard/employee_detail/:id/add_liste' className="nav-link mb-2 ms-3 fs-5">
              <FontAwesomeIcon icon={faList} className="icon" />
              Expenses List
            </Link>
          </li>
          <li onClick={handleLogout} className="d-flex justify-content-center me-4">
            <Link to='/dashboard' className="nav-link mb-2 ms-2 mt-2 text-danger  fs-3">
              <FontAwesomeIcon icon={faPowerOff} className="icon" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <div className="header">
          <h4> Employee Dashboard</h4>
        </div>
        {/* <div className="main-content">
          <div className="employee-list">
            <h2>Employee List</h2>
            <ul>
              {employees.map(employee => (
                <li key={employee.id}>
                  <Link to={`/employee_detail/${employee.id}`}>{employee.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default DashboardEmp;
