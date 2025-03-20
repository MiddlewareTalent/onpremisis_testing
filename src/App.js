import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './HomePage/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './HomePage/Dashboard';
import Employee from './HomePage/Employee';
import EmployeeDetails from "./EmployeeComponents/EmployeeDetails";
import TokenExpirationCheck from './Components/TokenExpirationCheck';
import Contacts from './HomePage/MyContacts/Contacts';
import NewContacts from './HomePage/MyContacts/NewContacts';
import UpdateContacts from './HomePage/MyContacts/UpdateContacts';
import ContactsDetails from './HomePage/MyContacts/ContactsDetails';
import AssignedTasks from './HomePage/Tasks/AssignedTasks';
import MyTasks from './HomePage/Tasks/MyTasks';
import EmployeesList from './HomePage/Tasks/EmployeesList';
import ManagerTimesheets from './Timesheet/ManagerTimesheets';
import EmployeeHomePage from './Timesheet/EmployeeHomePage';
import TimesheetManagement from './Timesheet/TimesheetManagement';
import TimesheetSubmission from './Timesheet/TimesheetSubmission';
//leave imports
import LeaveApprovalDashboard from './Leave/LeaveAdmin.jsx'
import LeaveRequestForm from './Leave/LeaveForm.jsx'
import LeaveEmployee from './Leave/LeaveEmployee.jsx';
import Chart from './OrganizationChart/Chart.jsx';
import GivenBadges from './HomePage/Badges/GivenBadges';
import OtherEmployeesList from './HomePage/Badges/OtherEmployeesList';
import Badges from './HomePage/Badges/Badges';
import RecievedBadges from './HomePage/Badges/RecievedBadges';
import Tasks from './HomePage/Tasks/Tasks.jsx'
import LeaveMain from './Leave/LeaveMain.jsx'
import TimesheetMain from './Timesheet/TimesheetMain.jsx';
import LeaveSheet from './Leave/LeaveSheet.jsx';
import ChangePassword from './Components/ChangePassword.jsx';
import ProfileCard from './EmployeeComponents/ProfileCard.jsx';
import EmpContactsDetails from './EmployeeComponents/EmpContactsDetails.jsx';
import MyTeam from './HomePage/MyTeam.jsx';

function App() {
const [submissions, setSubmissions] = useState([]);

  

  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('email') && localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        {/* Redirect to login if not logged in */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/*" element={<Main submissions={submissions} setSubmissions={setSubmissions} />} />
      </Routes>
    </Router>
  );
}

function Main({ submissions, setSubmissions }) {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  

  return (
    <>
      {showNavbar && <Navbar />}
      <TokenExpirationCheck />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<Employee />} />
        {/* Add more routes as needed */}
        <Route path="/employeedetails/:id/:employeeId" element={<EmployeeDetails />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/NewContacts" element={<NewContacts />} />
        <Route path="/ContactsDetails/:contactId" element={<ContactsDetails />} />
        <Route path="/UpdateContacts/:contactId" element={<UpdateContacts />} />
        <Route path="/AssignedTasks" element={<AssignedTasks />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/MyTasks" element={<MyTasks />} />
        <Route path="/CreateTask" element={<EmployeesList />} />
        <Route path="/ManagerTimesheets" element={<ManagerTimesheets />} />
        <Route path="/EmployeeHomePage" element={<EmployeeHomePage submissions={submissions} setSubmissions={setSubmissions} />} />
        <Route path="/timesheet-management" element={<TimesheetManagement setSubmissions={setSubmissions} />} />
        <Route path="/timesheet-submission" element={<TimesheetSubmission setSubmissions={setSubmissions} />} />
        <Route path='/TimesheetManage' element={<TimesheetMain/>}/>
        <Route path="/LeaveForm" element={<LeaveRequestForm />} />
        <Route path="/ReceivedLeaves" element={<LeaveApprovalDashboard />} />
        <Route path='/SubmittedLeaves' element={<LeaveEmployee />} />
        <Route path='/OrgChart' element={<Chart/>}/>
        <Route path='/GivenBadges' element={<GivenBadges/>}/>
        <Route path='/RecievedBadges' element={<RecievedBadges/>}/>
        <Route path='/Badges' element={<Badges/>}/>
        <Route path='/OtherEmployeesList' element={<OtherEmployeesList/>}/>
        <Route path='/LeaveManagement' element={<LeaveMain/>}/>
        <Route path='/LeaveSheet' element={<LeaveSheet/>}/>
        <Route path='/ChangePassword' element={<ChangePassword/>} />
        <Route path='/ProfileCard' element={<ProfileCard/>} />
        <Route path='/EmpContactsDetails/:contactId' element={<EmpContactsDetails/>} />
        <Route path='/MyTeam' element={<MyTeam/>} />
      </Routes>
    </>
  );
}

export default App;
