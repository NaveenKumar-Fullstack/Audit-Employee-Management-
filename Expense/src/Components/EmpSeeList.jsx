import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../base_url";

function EmpSeeList() {
  const [list, setList] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${baseUrl}/employee/list/${id}`)
      .then(result => {
        if (result.data.Status) {
          setList(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, [id]); // Include id in the dependency array

  const cleanUpString = (str) => {
    // Split the string by commas and remove any non-alphanumeric characters from each element
    return str.split(',').map(item => item.replace(/[^\w\s]/gi, '').trim()).join(', ');
  };
  

  return (
    <div className="px-5 mt-3">
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type of Expenses</th>
              <th>Travel Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Details</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => ( 
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{cleanUpString(item.expense)}</td>
                <td>{cleanUpString(item.travel)}</td>
                <td>{item.amount}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.details}</td>
                <td>
                  {item.pdf_path && (
                    <a href={`${baseUrl}/pdf/${item.pdf_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">View PDF</a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmpSeeList;
