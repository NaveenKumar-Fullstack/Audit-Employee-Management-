import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactSelect, { components } from 'react-select';
import { baseUrl } from '../base_url';

const AddList = () => {
  const Option = (props) => {
    return (
      <div key={props.value}>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{' '}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const initialFormData = {
    empid: '', // New field for empid
    name: '',
    expense: [],
    travel: [],
    amount: '',
    date: '',
    details: '',
    pdf: null,
  };

  const [values, setValues] = useState(initialFormData);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/auth/employee`)
      .then(response => {
        if (response.data.Status) {
          setEmployeeData(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch(error => console.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file inputs separately
    if (name === 'pdf') {
      setValues(prevValues => ({
        ...prevValues,
        [name]: files[0],
      }));
    } else {
      setValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (selectedOption) => {
    const selectedEmpid = selectedOption.value;
    const selectedEmployee = employeeData.find(employee => employee.empid === selectedEmpid);
    setValues(prevValues => ({
      ...prevValues,
      empid: selectedEmpid,
      name: selectedEmployee ? selectedEmployee.name : '',
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate all fields are filled
      if (Object.values(values).some(value => !value)) {
        throw new Error('All fields are required');
      }

      // Parse amount
      const parsedAmount = parseFloat(values.amount);
      if (isNaN(parsedAmount)) {
        throw new Error('Amount must be a valid number');
      }

      // Format date
      const formattedDate = new Date(values.date).toISOString();

      // Create form data
      const formData = new FormData();
      formData.append('empid', values.empid);
      formData.append('name', values.name);
      formData.append('expense', JSON.stringify(values.expense));
      formData.append('travel', JSON.stringify(values.travel));
      formData.append('amount', values.amount);
      formData.append('date', formattedDate);
      formData.append('details', values.details);
      formData.append('pdf', values.pdf);

      // Submit form data
      const response = await axios.post(
        `${baseUrl}/auth/add_list`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Server Response:', response.data);

      alert('Expense submitted successfully');

      // Reset form values
      setValues(initialFormData);
    } catch (error) {
      console.error('Error submitting expense:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <form className="p-3 rounded w-50 border">
        <h1>Expense Details</h1>
        <hr />
        <div className="contact-form">
          <div className="col-25">
            <label>Employee ID</label>
            <ReactSelect
              options={employeeData.map(employee => ({ value: employee.empid, label: employee.empid }))}
              onChange={handleSelectChange}
              value={employeeData.find(employee => employee.empid === values.empid)}
            />
          </div>
          <div className="col-25">
            <label>Employee Name</label>
            <input
              type="text"
              placeholder="Employee Name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Expense Type</label>
            <span className="d-inline-block">
              <ReactSelect
                options={[
                  { value: 'travel', label: 'Travel' },
                  { value: 'hotel', label: 'Hotel' },
                ]}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option }}
                onChange={(selectedOptions) => setValues(prevValues => ({ ...prevValues, expense: selectedOptions.map(option => option.value) }))}
                value={values.expense.map((option) => ({ value: option, label: option }))}
              />
            </span>
          </div>
          <div>
            <label>Travel Type</label>
            <span className="d-inline-block">
              <ReactSelect
                options={[
                  { value: 'train', label: 'Train' },
                  { value: 'bus', label: 'Bus' },
                  { value: 'cab', label: 'Cab' },
                  { value: 'auto', label: 'Auto' },
                ]}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option }}
                onChange={(selectedOptions) => setValues(prevValues => ({ ...prevValues, travel: selectedOptions.map(option => option.value) }))}
                value={values.travel.map((option) => ({ value: option, label: option }))}
              />
            </span>
          </div>
          <div className="col-25">
            <label>Expense Amount</label>
            <input
              type="number"
              placeholder="Expense Amount"
              name="amount"
              value={values.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="col-25">Expense Date</label>
            <input
              type="date"
              placeholder="Expense Date"
              name="date"
              value={values.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Details of Expense</label>
            <textarea
              placeholder="Details of Expense"
              name="details"
              rows={4}
              cols={40}
              value={values.details}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label htmlFor="inputGroup01" className="form-label">
              Select PDF Document
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroup01"
              onChange={handleChange}
              name="pdf"
              accept=".pdf"
            />
          </div>
          <div>
            <button
              className="btn btn-success w-100"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddList;
