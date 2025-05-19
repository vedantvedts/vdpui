import './App.css';
import 'core-js/stable'; // Polyfills for modern JavaScript features
import 'regenerator-runtime/runtime'; // Polyfill for async/await functionality
import Login from  'components/login/login.component.jsx';
import AuditStampingComponent from './components/admin/auditStamping.component.jsx';
import { Routes, Route } from "react-router-dom";
import Dashboard from './components/dashboard/dashboard.component';
import UseIdleTimer from 'common/idle-logout';
import UserManagerComponent from 'components/admin/userManager.component';
import FormRoleAccess from 'components/admin/formRoleAccess.component';
//import DivisionComponent from 'components/admin/division.component';
//import DivisionGroupComponent from 'components/admin/divisionGroup.component';
import ProjectComponent from 'components/admin/project.component';
import EmployeeComponent from 'components/admin/employee.component';
import DesignationComponent from 'components/admin/designation.component';
import UserManualDocRecordsComponent from 'components/userManual/usermanual-doc-records';


function App() {
  return (
    <div className="App">
      <UseIdleTimer/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audit-stamping" element={<AuditStampingComponent />} />

        {/* Admin */}
        <Route path="/user-manager-list" element={<UserManagerComponent />} />
        <Route path="/form-role-access" element={<FormRoleAccess />} />
        {/* <Route path="/division" element={<DivisionComponent />} />
        <Route path="/division-group" element={<DivisionGroupComponent />} /> */}
         <Route path="/employee" element={<EmployeeComponent/>}  />
         <Route path="/designation" element={<DesignationComponent/>}  />
         <Route path="/project" element={<ProjectComponent />} />
         <Route path="/user-manual" element={<UserManualDocRecordsComponent />} />
      </Routes>
{/* <Login/> */}
    </div>
  );
}

export default App;
