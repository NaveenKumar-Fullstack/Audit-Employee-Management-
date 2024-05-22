import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import '../../src/App.css';
import { baseUrl } from '../base_url';

const EditExpense = () => {
  const { id } = useParams(); 

  const [values, setValues] = useState({
    name: '',
    expenseType: [],
    travelType: [],
    amount: '',
    date: '',
    details: '',
  });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/get_expense/${id}`);
        setValues(response.data.Result[0]);
      } catch (error) {
        console.error('Error fetching expense:', error);
      }
    };

    fetchExpense();
  }, [id]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post(`${baseUrl}/auth/edit_expense/${id}`, values);
      console.log('Expense edited successfully:', response.data);
      alert('Expense edited successfully');
    } catch (error) {
      console.error('Error editing expense:', error);
      alert(`Error editing expense: ${error.message}`);
    }
  };

  return (
    <div className="main">
      <form className="card-contact" onSubmit={handleSubmit}>
        <h1>Edit Expense</h1>
        <hr />
        <div className="contact-form">
          <div className="col-25">
            <label>Employee Name</label>
            <input
              type="text"
              placeholder="Enter your name"
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
                components={{
                  Option: (props) => (
                    <components.Option {...props}>
                      <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                      />{' '}
                      <label>{props.label}</label>
                    </components.Option>
                  ),
                }}
                onChange={(selectedOptions) =>
                  setValues((prevValues) => ({
                    ...prevValues,
                    expenseType: selectedOptions.map(({ value }) => value),
                  }))
                }
                value={values.expenseType ? values.expenseType.map((option) => ({
                  value: option,
                  label: option,
                })) : []}
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
                components={{
                  Option: (props) => (
                    <components.Option {...props}>
                      <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                      />{' '}
                      <label>{props.label}</label>
                    </components.Option>
                  ),
                }}
                onChange={(selectedOptions) =>
                  setValues((prevValues) => ({
                    ...prevValues,
                    travelType: selectedOptions.map(({ value }) => value),
                  }))
                }
                value={values.travelType ? values.travelType.map((option) => ({
                  value: option,
                  label: option,
                })) : []}
              />
            </span>
          </div>
          <div className="col-25">
            <label>Expense Amount</label>
            <input
              type="number"
              placeholder="Enter Expense Amount"
              name="amount"
              value={values.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="col-25">Expense Date</label>
            <input
              type="date"
              placeholder="Enter Expense Date"
              name="date"
              value={values.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Details of Expense</label>
            <textarea
              placeholder="Enter Expense Details"
              name="details"
              rows={4}
              cols={40}
              value={values.details}
              onChange={handleChange}
            />
          </div>
          <div>
            <button className="button" type="submit">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>  
  );
};

export default EditExpense;
