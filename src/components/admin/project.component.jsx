import withRouter from 'common/with-router';
import Datatable from 'components/datatable/Datatable';
import Navbar from 'components/navbar/Navbar';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { getProjectMasterList } from 'services/admin.serive';
import ProjectAddEdit from './project.add.edit.component';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

const ProjectMaster = ({ router }) => {

const [projectDetailsList, setProjectDetailsList] = useState([]);
const [status, setStatus] = useState('list');
const[projectMasterData,setprojectMasterData]= useState('');

useEffect(() => {
    fetchProjectMasterList();
  }, []);

const fetchProjectMasterList = async () => {
    try {
        const projectDetails = await getProjectMasterList();
        mappedData(projectDetails);
    } catch (error) {
        console.error("An error occured");
    }
};

const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Project Code', selector: (row) => row.prjCode, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Project Name', selector: (row) => row.prjName, sortable: true, grow: 2, align: 'text-left' }, 
    { name: 'Project Short Name', selector: (row) => row.prjShortName, sortable: true, grow: 2 , align: 'text-center'},
    { name: 'Description', selector: (row) => row.prjDescription, sortable: true, grow: 2 , align: 'text-left'},
    { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', }, 
];


const mappedData = (list) => {
    setProjectDetailsList(
        list.map((item, index) => ({
            sn: index + 1,
            prjCode: item.projectCode || '-',
            prjName: item.projectName || '-',
            prjShortName: item.projectShortName || '-',
            prjDescription: item.projectDescription || '-',
            action: (
                          <>
                           <button className=" btn btn-warning btn-sm me-1"  title="Edit" onClick={()=>edit(item)}> 
                            <FaEdit/>
                           </button>
                           </>
                        ),
        }))
    );
};

       const addProjectMaster = () =>{
                setStatus('add');
            }

       const edit =(item)=>{
              setprojectMasterData(item)
              setStatus('edit')
      }


   switch (status) {
                case 'add':
                  return <ProjectAddEdit mode={'add'}></ProjectAddEdit>;
                case 'edit':
                  return <ProjectAddEdit mode={'edit'} projectMasterData={projectMasterData}></ProjectAddEdit>;
                default:
                return (
        <div>
          <Navbar></Navbar>
          <div className="card">
                <div className="card-body text-center">
                    <h3>Project Master List</h3>
                    <div id="card-body customized-card">
                        {<Datatable columns={columns} data={projectDetailsList} />}
                    </div>
                      <div align="center" >
            <button className="mt-2 btn add" onClick={() => addProjectMaster()}> ADD</button>
        
          </div>
                </div>
            </div>
       </div>
    );
}
    }

export default withRouter(ProjectMaster);