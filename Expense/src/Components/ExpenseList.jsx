import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../base_url";

function ExpenseList() {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); 

  useEffect(() => {
    axios.get(`${baseUrl}/auth/list`)
      .then(result => {
        if (result.data.Status) {
          setList(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const cleanUpString = (str) => {
    return str.split(',').map(item => item.replace(/[^\w\s]/gi, '').trim()).join(', ');
  };

  const handleDelete = (id) =>{
    axios.delete(`${baseUrl}/auth/delete_expense/${id}`)
    .then(result =>{
      if(result.data.Status){
        window.location.reload();
      } else {
        alert(result.data.Error);
      }
    });
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        {/* <h3>Expense List</h3> */}
      </div>
      <Link to='/dashboard/add_list' className="btn btn-success">Add Expense List</Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>EmpID</th>
              <th>Name</th>
              <th>Type of Expenses</th>
              <th>Travel Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Details</th>
              <th>PDF</th> 
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.empid}</td>
                <td>{item.name}</td>
                <td>{cleanUpString(item.expense)}</td>
                <td>{cleanUpString(item.travel)}</td>
                <td>{item.amount}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.details}</td>
                <td>
                  
                  {item.pdf_path && (
                    <a href={`${baseUrl}/pdf/`+item.pdf_path} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">View PDF</a>
                  )}
                </td>
                <td>
                  <Link to={`/dashboard/edit_expenselist/${item.id}`} className="btn btn-info btn-sm me-2">Edit</Link>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-warning btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       
        <ul className="pagination d-flex justify-content-center mt-5">
        <span>Next Page: </span>
          {Array.from({ length: Math.ceil(list.length / itemsPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="btn btn-info rounded-1 ms-2">{index + 1}</button>
            </li>
            
          ))}
             

        </ul>
      </div>
    </div>
  );
}

export default ExpenseList;
