import withRouter from 'common/with-router';
import Datatable from 'components/datatable/Datatable';
import Navbar from 'components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { getEmployeeMasterList } from 'services/admin.serive';

const EmployeeComponent = ({ router }) => {

const [employeeDetailsList, setEmployeeDetailsList] = useState([]);

useEffect(() => {
    fetchEmployeeetailsList();
  }, []);

const fetchEmployeeetailsList = async () => {
    try {
        const employeeDetails = await getEmployeeMasterList();
        console.log("employee List @@@@"+JSON.stringify(employeeDetails))
        mappedData(employeeDetails);
    } catch (error) {
        console.error("An error occured");
    }
};

const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
  
    { name: 'Employee Name', selector: (row) => row.empName, sortable: true, grow: 2, align: 'text-left' }, 
    { name: 'Employee Code', selector: (row) => row.empCode, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Employee Designation', selector: (row) => row.empDesig, sortable: true, grow: 2 , align: 'text-center'},
    { name: 'Mobile', selector: (row) => row.mobile, sortable: true, grow: 2 , align: 'text-center'},
    { name: 'Email', selector: (row) => row.email, sortable: true, grow: 2 , align: 'text-left'},
];

const mappedData = (list) => {
    setEmployeeDetailsList(
        list.map((item, index) => ({
            sn: index + 1,
            // empName: item.empName+', '+item.empDesig || '-',
            empName: item.empName,
            empCode: item.empNo || '-',
            empDesig: item.empDesigName,
            mobile: item.mobileNo || '-',
            email: item.email || '-',
        }))
    );
};


    return (
        <div>
            <Navbar></Navbar>
            <div className="card">
                <div className="card-body text-center">
                    <h3>Employee Master List</h3>
                    <div id="card-body customized-card">
                        {<Datatable columns={columns} data={employeeDetailsList} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(EmployeeComponent);