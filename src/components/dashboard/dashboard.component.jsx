import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./dashboard.css";
import { Autocomplete, TextField, Box, ListItemText, Typography } from '@mui/material';
import { CustomMenuItem } from 'services/auth.header';
import { format } from "date-fns";
import { AgCharts } from 'ag-charts-react'; 
import Datatable from "components/datatable/Datatable";


const Dashboard = () => {
  let currentLoggerRoleName = localStorage.getItem('roleName');
  let currentLoggerRoleId =   localStorage.getItem('roleId');
  let currentLoggerEmpId =    localStorage.getItem('empId');
 
  return (
    <div 
    className={`dashboard-body`} 
    style={{ minHeight: '100vh' }} // Ensure full page height
  >
   <Navbar/>
      {/* <HeaderComponent /> */}

      {/* Main Content Below Header */}
      
      <div 
        className={`container-fluid page-body-wrapper dashboard-container`} 
        style={{ minHeight: '100vh' }} // Ensure full page height for the container
      >

<div 
        className={`content-wrapper dashboard-content-wrapper`} 
        style={{ minHeight: '100vh', transition: 'background-color 0.3s ease' }} // Ensure smooth transition for container background
      >


{/************************************DASHBOARD HEADER START ***************************************/}
<div className="dashboard-header  row ">
  
 </div>
{/************************************DASHBOARD HEADER END ***************************************/}   

{/************************************DASHBOARD CONTENT  START ***************************************/}
<div className="row dashboard-content">

{/************************************************ TOP CONTENT START******************************************************************************/}
 <div className="top-content-grid col-xl-12 col-lg-12 stretch-card grid-margin  ">
    <div className="card top-content-card">
      <div className="row">
            

     </div>
   </div>
 </div>
 {/************************************************ TOP CONTENT END******************************************************************************/}

{/************************************************ BOTTOM CONTENT START******************************************************************************/}
  <div className="bottom-content-grid col-xl-12 col-lg-12 stretch-card grid-margin ">
     <div className="card bottom-content-card">
         <div className="row ">
          
         </div>
       </div>

   </div>
{/************************************************ BOTTOM CONTENT START******************************************************************************/}
{/************************************ DASHBOARD CONTENT END ***************************************/}
 </div>
 </div>
  </div>
</div>
 );
};

export default Dashboard;



