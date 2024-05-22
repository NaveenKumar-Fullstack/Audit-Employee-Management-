
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom' ;
import Home from './Components/Home';
import Start from './Components/Start';
import EmployeeLogin from './Components/EmployeeLogin';
import Employee from './Components/Employee';
import ExpenseList from './Components/ExpenseList';
import Profile from './Components/Profile';
import AddList from './Components/AddList';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import EmployeeDetail from './Components/EmployeeDetail';
import AddListEmployee from './Components/AddListEmployee';
import PrivateRoute from './Components/PrivateRoute';
import RegisterAsEmp from './Components/RegisterAsEmp';
import EditExpense from './Components/EditExpense';
import EmpSeeList from './Components/EmpSeeList';



function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<RegisterAsEmp/>}></Route>
      <Route path='/' element={<Start/>}></Route>
      <Route path='/employee_login' element={<EmployeeLogin/>}></Route>
      <Route path='/employee_detail/:id' element={
    <PrivateRoute>
      <EmployeeDetail/>
    </PrivateRoute>
    }><Route path="/employee_detail/:id/add_liste" element={<AddListEmployee/>}></Route>
      <Route path="/employee_detail/:id/see_liste" element={<EmpSeeList/>}></Route>
      </Route>
    

      <Route path='/adminlogin' element={<Login/>}></Route>
      <Route path='/dashboard' element={
      <PrivateRoute>
        <Dashboard/>
      </PrivateRoute>
      }>
        <Route path='' element={<Home/>}></Route>
        <Route path='/dashboard/employee' element={<Employee/>}></Route>
        <Route path='/dashboard/add_employee' element={<AddEmployee/>}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee/>}></Route> 
        <Route path='/dashboard/expenselist' element={<ExpenseList/>}></Route>
        <Route path='/dashboard/edit_expenselist/:id' element={<EditExpense/>}></Route>
        <Route path='/dashboard/add_list' element={<AddList/>}></Route>
        <Route path='/dashboard/profile/:id' element={<Profile/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App