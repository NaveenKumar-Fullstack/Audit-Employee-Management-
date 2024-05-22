import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import '../../src/App.css';
import { baseUrl } from '../base_url';

const AddListEmployee = () => {
  const { id } = useParams();
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

  const [values, setValues] = useState({
    empid: id, // Initialize empid with the id from URL params
    name: '',
    expense: [],
    travel: [],
    amount: '',
    date: '',
    details: '',
    pdf: null, // Add PDF field to the initial form data
  });

  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/employee/detail/${id}`);
        if (response.data && response.data[0] && response.data[0].name) {
          setEmployeeName(response.data[0].name);
          setValues((prevValues) => ({
            ...prevValues,
            empid: id, // Set empid after fetching data
          }));
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'pdf') {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: files[0], // Update the PDF field with the selected file
      }));
    } else {
      setValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const handleSelectChange = (selectedOptions, selectionType) => {
    setValues((prevValues) => ({
      ...prevValues,
      [selectionType]: selectedOptions.map(({ value }) => value),
    }));
  };

  const handleSubmit = async () => {
    try {
      const missingFields = [];

      if (!values.empid) {
        missingFields.push('Employee ID');
      }
      if (!employeeName) {
        missingFields.push('Employee Name');
      }
      if (!values.expense.length) {
        missingFields.push('Expense Type');
      }
      if (!values.travel.length) {
        missingFields.push('Travel Type');
      }
      if (!values.amount) {
        missingFields.push('Expense Amount');
      }
      if (!values.date) {
        missingFields.push('Expense Date');
      }
      if (!values.details) {
        missingFields.push('Details of Expense');
      }

      if (missingFields.length > 0) {
        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
      }

      const parsedAmount = parseFloat(values.amount);
      if (isNaN(parsedAmount)) {
        throw new Error('Amount must be a valid number');
      }

      const formattedDate = new Date(values.date).toISOString();

      const formData = new FormData();
      formData.append('empid', values.empid); // Append empid to form data
      formData.append('name', employeeName);
      formData.append('expense', JSON.stringify(values.expense));
      formData.append('travel', JSON.stringify(values.travel));
      formData.append('amount', values.amount);
      formData.append('date', formattedDate);
      formData.append('details', values.details);
      formData.append('pdf', values.pdf); // Append the PDF file with the correct key
console.log(values);
      const response = await axios.post(
        `${baseUrl}/employee/add_liste`,
        formData
      );

      console.log('Server Response:', response.data);

      setValues({
        empid: id, // Reset empid to id after submitting
        name: '',
        expense: [],
        travel: [],
        amount: '',
        date: '',
        details: '',
        pdf: null,
      });

      alert('Expense submitted successfully');
    } catch (error) {
      console.error('Error submitting expense:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="main">
      <form className="card-contact">
        <h1>Expense Details</h1>
        <hr />
        <div className="contact-form">
          <div className="col-25 visually-hidden">
            <label>Employee ID</label>
            <input
              type="text"
              placeholder="Employee ID"
              name="empid"
              value={values.empid}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="col-25">
            <label>Employee Name</label>
            <input
              type="text"
              placeholder="Employee Name"
              name="name"
              value={employeeName}
              onChange={() => null}
              readOnly
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
                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'expense')}
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
                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'travel')}
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
              placeholder="Expense Details"
              name="details"
              rows={4}
              cols={40}
              value={values.details}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label htmlFor="pdf" className="form-label">
              Select PDF Document
            </label>
            <input
              type="file"
              className="form-control"
              id="pdf"
              onChange={handleChange}
              name="pdf"
              accept=".pdf"
            />
          </div>
          <div>
            <button className="button" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddListEmployee;
