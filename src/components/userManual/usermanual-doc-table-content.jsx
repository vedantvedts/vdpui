import { Box, Button, IconButton, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import withRouter from "common/with-router";
import Datatable from "components/datatable/Datatable";
import Navbar from "components/navbar/Navbar";
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MdEditSquare, MdImageSearch, MdTableView } from "react-icons/md";

import UserManualAddDocContentEditorComponent from 'components/userManual/usermanual-add-content-editor';
import { getUserManualTableContentById, getUserManualTableContentList } from "services/usermanual.service";
import UserManualDocContentDialog from "./usermanual-doc-content-dialog";



const UserManualDocTableComponent = (props)=>{

    
    const versionElements = props?.versionElements;
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [status, setStatus] = useState('');
    const [tableContentList, setTableContentList] = useState([]);
    const [open, setOpen] = useState(false);
    const [contentType, setContentType] = useState(null);
    const [selectedRowData, setSelectedRowData] = useState([]);

    
    const [ProjectSelDto, setProjectSelDto] = useState(null);

       const fetchData = async () => {
        try {
            const projectSelDtoData = {
                projectId: versionElements.projectId
                };
            let tableContentList =  await getUserManualTableContentList(projectSelDtoData);
            setTableContentList(tableContentList);
            setProjectSelDto(projectSelDtoData);
        } catch (error) {
            setError('An error occurred');
            console.error(error)
        }
    }
    
    useEffect(() => {
        fetchData();
    }, [selectedTab]);
    
        const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleEditContent = async (contentId) => {
        let data = await getUserManualTableContentById(contentId);
        if (!Array.isArray(data)) {
            data = [data];
        }
        setSelectedRowData(data);
        setOpen(true);
    };


     const columns = [   
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
        { name: 'Content Name', selector: (row) => row.contentName, sortable: true, grow: 2, align: 'text-left' },
        { name: 'Content Description', selector: (row) => row.contentDescription, sortable: true, grow: 2, align: 'text-left' },
        { name: 'Page Number', selector: (row) => row.contentPageNo, sortable: true, grow: 2, align: 'text-left' },
        { name: 'Action', selector: (row) => row.action, action: false, grow: 2, align: 'text-center' },
    ];
  

     const getMappedData = () => {
        return tableContentList.filter(data => data.contentType === 'T')
        .map((item, index) => ({
          sn: index + 1,
          contentName: item.contentName || '-',
          contentDescription: item.contentDescription || '-',
          contentPageNo: item.contentPageNo || '-',
          action: (
                <Tooltip title="Edit Content">
                  <IconButton 
                    id="iconButtons" 
                    className="icon-edit" 
                    onClick={() => handleEditContent(item.contentId)}
                  >
                    <MdEditSquare />
                  </IconButton>
                </Tooltip>
          ),
        }));
      };


        const columns1 = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
        { name: 'Content Name', selector: (row) => row.contentName, sortable: true, grow: 2, align: 'text-left' },
        { name: 'Content Description', selector: (row) => row.contentDescription, sortable: true, grow: 2, align: 'text-left' },
        { name: 'Page Number', selector: (row) => row.contentPageNo, sortable: true, grow: 2, align: 'text-left' },
        { name: 'Action', selector: (row) => row.action, action: false, grow: 2, align: 'text-center' }
        ];

    const getMappedData1 = () => {
        return tableContentList.filter(data => data.contentType === 'F')
        .map((item, index) => ({
          sn: index + 1,
          contentName: item.contentName || '-',
          contentDescription: item.contentDescription || '-',
          contentPageNo: item.contentPageNo || '-',
          action: (
            <Tooltip title="Edit Content">
              <IconButton 
                id="iconButtons" 
                className="icon-edit" 
                onClick={() => handleEditContent(item.contentId)}
              >
                <MdEditSquare />
              </IconButton>
            </Tooltip>
         ),
        }));
    };

    const handleAddContent = (type) =>{
        setOpen(true);
        setContentType(type);
        setSelectedRowData([]);
    };

   const goBack = () => {
        setStatus('umDocContent');
    };


    
switch (status) {
    case 'umDocContent':
        return <UserManualAddDocContentEditorComponent versionElements={versionElements}></UserManualAddDocContentEditorComponent>;
    default:
    return (
    <Box id="qms-wrapper">
        <Helmet>
            <title>User Manual Content List</title>
        </Helmet>
        <Navbar/>
        <Box id="main-container">
                <Box id="main-wrapper">
                <Tabs className="max-h35" value={selectedTab} onChange={handleTabChange} aria-label="inspection tabs"  variant="fullWidth" >
                    <Tab className='mgt8' sx={{ '&.Mui-selected': { backgroundColor: 'moccasin' } }} icon={<MdTableView className="tab-icons" />} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Content of Tables</span>} />
                    <Tab className='mgt8' sx={{ '&.Mui-selected': { backgroundColor: 'moccasin' } }} icon={<MdImageSearch className="tab-icons"/>} iconPosition="start"  label="Content of Figures" />
                  </Tabs>
                  <Box className="subHeadingLink d-flex flex-column flex-md-row justify-content-end">
                        <Box className=" text-md-end mt-2 mt-md-0">
                          <Button className="project-div" variant="contained">
  {`Doc Content for ${versionElements.projectMasterDto?.projectName ?? ''}`}
</Button>
                        </Box>
                    </Box>
                    {selectedTab === 0 && (
                        <Box id="card-body customized-card">
                                <Datatable columns={columns} data={getMappedData()} />
                            <br />
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Button variant="contained" color="primary" onClick={() => handleAddContent('T')}>
                                    Add New
                                </Button>
                                <Button onClick={goBack} className="back ms-1">Back</Button>
                            </Box>
                            <br />
                        </Box>
                    )}
                {selectedTab === 1 && 
                <Box id="card-body customized-card">
                            <Datatable columns={columns1} data={getMappedData1()} />
                      <br />
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                               <Button variant="contained" color="primary" onClick={() => handleAddContent('F')}>
                                    Add New
                                </Button>
                                <Button onClick={goBack} className="back ms-1">Back</Button>
                            </Box>
                            <br />
                    </Box>}
                </Box>
                <UserManualDocContentDialog open={open} onClose={() => setOpen(false)} qaqtDocData={ProjectSelDto} type={contentType} 
                      fetchData={fetchData} editData={selectedRowData} />
            </Box>
    </Box>
);
};




};

export default withRouter(UserManualDocTableComponent);
