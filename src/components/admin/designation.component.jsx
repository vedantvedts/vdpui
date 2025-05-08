import withRouter from 'common/with-router';
import Datatable from 'components/datatable/Datatable';
import Navbar from 'components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { getEmployeeDesignationMasterList } from 'services/admin.serive';

const DesignationComponent = ({ router }) => {

const [employeeDetailsList, setEmployeeDetailsList] = useState([]);

useEffect(() => {
    fetchEmployeeetailsList();
  }, []);

const fetchEmployeeetailsList = async () => {
    try {
        const employeeDesigDetails = await getEmployeeDesignationMasterList();
        console.log("employee desig List @@@@"+JSON.stringify(employeeDesigDetails))
        mappedData(employeeDesigDetails);
    } catch (error) {
        console.error("An error occured");
    }
};

const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Designation Code', selector: (row) => row.desigCode, sortable: true, grow: 2, align: 'text-center' }, 
    { name: 'Designation', selector: (row) => row.desigName, sortable: true, grow: 2 , align: 'text-center'},
];

const mappedData = (list) => {
    setEmployeeDetailsList(
        list.map((item, index) => ({
            sn: index + 1,
            desigCode: item.desigCode,
            desigName: item.designation,
        }))
    );
};


    return (
        <div>
            <Navbar></Navbar>
            <div className="card">
                <div className="card-body text-center">
                    <h3>Designation Master List</h3>
                    <div id="card-body customized-card">
                        {<Datatable columns={columns} data={employeeDetailsList} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(DesignationComponent);