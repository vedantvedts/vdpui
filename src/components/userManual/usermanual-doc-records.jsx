import { useEffect, useState, useCallback } from "react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box, Typography, Button,  Snackbar, Alert, IconButton, TextField, Grid, Autocomplete, InputLabel, Select, MenuItem, FormControl, ListItemText } from '@mui/material';
import { Helmet } from "react-helmet";
import withRouter from "../../common/with-router";
import Navbar from "components/Navbar/Navbar";
import { format } from "date-fns";
import { Field, Form, Formik, ErrorMessage } from "formik";
import Datatable from "components/datatable/Datatable";
import { CustomMenuItem } from "services/auth.header";
import { getEmployeeMasterList, getProjectMasterList } from 'services/admin.serive';
import { getAllUserManualDocVersionDtoListByProject, getUserManualDocTransactionList } from "services/usermanual.service";
import AlertConfirmation from "common/AlertConfirmation.component";
import UserManualDocAddIssueDialog from 'components/userManual/usermanual-add-isssue-dialog';
import UserManualAddDocContentEditorComponent from 'components/userManual/usermanual-add-content-editor';


const UserManualDocRecordsComponent = ({props}) => {

  const [isReady,setIsReady] = useState(false);

  const selectedempId = localStorage.getItem('empId');
  const selectedroleId = localStorage.getItem('roleId');
  const [status, setStatus] = useState('');


  const [initialValueOfProjectSel, setInitialValueOfProjectSel] = useState({
    projectId: props?.projectId || '',
});



const [fullProjectList,setFullProjectList] = useState([]);
const [currentSelectProjectName, setCurrentSelectProjectName] = useState('');
const [selectedProjectId, setSelectedProjectId] = useState([]);
const [filteredProjectList, setFilteredProjectList] = useState([]);
const [userManualVersionListRefresh, setUserManualVersionListRefresh] = useState('');
const [userManualDocVersionListByProject, setUserManualDocVersionListByProject] = useState([]);
const [userManualDocTrans,setUserManualDocTrans] = useState([])
const [versionElementData, setVersionElementData] = useState(null);
const [singleDoc, setSingleDoc] = useState([]);
const [openAddNewVersDialog, setOpenAddNewVersDialog] = useState(false);
const [empId,setEmpId] = useState(0);
const [empList,setEmpList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectToUserManualDocumentEditor = useCallback((element) => {
    setStatus('userManualDocContent');
    setVersionElementData(element);
}, []);

  const addNewVersion = () => {
    setOpenAddNewVersDialog(true);
}

const handleCloseAddNewVersDialog = () => {
  setOpenAddNewVersDialog(false)
  setSingleDoc([]);
  setUserManualVersionListRefresh(!userManualVersionListRefresh)
};

const handleAddIssueConfirm = async (response)=>{
  if(response.docVersionReleaseId > 0) {
          const docTrans  = await getUserManualDocTransactionList();
          setUserManualDocTrans(docTrans)
          Swal.fire({
              icon: "success",
              title: 'Success',
              text: `User Manual New Version/Release Added Successfully`,
              showConfirmButton: false,
              timer: 2600
          });      

  } else {
     Swal.fire({
      icon: "error",
      title: 'Error',
      text: `User Manual New Version/Release Add UnSuccessfull`,
      showConfirmButton: false,
      timer: 2600
  });      

  }
}


  useEffect(() => {
    fetchInitialUserManualDocData();
},[isReady]);

const fetchInitialUserManualDocData = async () =>{
  // const mqapExitingDoc   =  await getPrjDocVersionList();
  // const qaqtReq          = await qaQtReqList();
  // const proRep           = await getProjectRepList();
  // const cmtMembersLinked = await getCommitteMembersLinked('QAQTDocs');
  const employeeList     = await getEmployeeMasterList();
  const docTrans         = await getUserManualDocTransactionList();
  setUserManualDocTrans(docTrans)
  const empId = localStorage.getItem('empId');
  setEmpId(empId)
  const filEmp = employeeList.map(item=>({
   value : item.empId,
   label : item.empName+', '+item.empDesigCode
   }));
   setEmpList(filEmp);
  //setCommitteMembersLinkedList(cmtMembersLinked);
  //setProjectRepList(proRep);
  //setQaqtRepReqList(qaqtReq);
  //setMqapExitingProjects(mqapExitingDoc);

  setIsReady(true);
}


  useEffect(() => {
    fetchData();
}, [initialValueOfProjectSel.projectId]);

useEffect(() => {
  fetchUserManualDocVersionData();
}, [initialValueOfProjectSel.projectId,userManualVersionListRefresh]);

const fetchUserManualDocVersionData = async () => {

  try {
    let projectIdData = initialValueOfProjectSel.projectId;
      const projectSelDto = {
          projectId:  projectIdData,
        };

        const UserManualocVersionListByProject = await getAllUserManualDocVersionDtoListByProject(projectSelDto);
        setUserManualDocVersionListByProject(UserManualocVersionListByProject);

  } catch (error) {
      // console.error(error)
      setError('An error occurred');
      setIsLoading(false);
  }
}




const fetchData = async () => {
  try {
          let projectId = initialValueOfProjectSel.projectId;
          let ProjectList = [];
          ProjectList = await getProjectMasterList();
          // we can later changes this getProjectMasterList  based on emmployee logged in project filteration if required only
          setFullProjectList(ProjectList);
          var projectListArray =[];
          ProjectList.forEach(obj=>{
              let  projectdto={projectId:obj.projectId, projectName:obj.projectName, projectCode:obj.projectCode,platform : obj.platform,projectShortName : obj.projectShortName};
              projectListArray.push(projectdto);
          })
          
          if (projectListArray && projectListArray.length > 0 && projectId === '') {
            projectId = projectListArray[0].projectId
          
          }else{
            if(projectListArray && projectListArray.length > 0 && initialValueOfProjectSel.projectId){
               const project = projectListArray.find(data => data.projectId === initialValueOfProjectSel.projectId);
            }
            setFilteredProjectList(projectListArray);
        }
        setSelectedProjectId(projectId);
    
      
      setInitialValueOfProjectSel({
              ...initialValueOfProjectSel,
              projectId: projectId
          });

      setIsLoading(false);

  } catch (error) {
      setError('An error occurred');
      setIsLoading(false);
      // console.error(error)
  }
}





const handleProjectFieldChange = async (field, value, values) => {
  const newValues = { ...values, [field]: value };
  setInitialValueOfProjectSel({
      ...initialValueOfProjectSel,
      projectId: newValues.projectId
  });
  setSelectedProjectId(newValues.projectId);
};



  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%' },
    { name: 'Particulars', selector: (row) => row.particulars, sortable: true, grow: 2 , width: '18%'},
    { name: 'From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center', width: '8%' },
    { name: 'To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center', width: '8%' },
    { name: 'Issue Date', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center', width: '10%' },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center', width: '18%' },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center', width: '22%' },
];



const getMappedData = () => {
  return userManualDocVersionListByProject.map((item, index) => {
      // let isForwarded = false;
      // let isVerified  = false;
      // let isApproved  = false;
      // let isRevoke    = false;
      // let isReturn    = false;
      let haveRemarks = false;
      // let fwdMemTypes = [];
      // let revMemTypes = [];
      // let verMemTypes = [];

     const remarks =  userManualDocTrans.filter(data => data.docVersionReleaseId == item.docVersionReleaseId && data.attachmentName !== '');
     if(remarks && remarks.length > 0){
         haveRemarks = true; 
      }

      // let gdDhqa = committeMembersLinkedList.find(data => data.irfId == item.docVersionReleaseId && data.memberType == 'gdDhqa');
      // let gdDsqa = committeMembersLinkedList.find(data => data.irfId == item.docVersionReleaseId && data.memberType == 'gdDsqa');
      // let adQa   = committeMembersLinkedList.find(data => data.irfId == item.docVersionReleaseId && data.memberType == (isAirbrone?'gdAqa':'adQa'));

      // const prjReps = item.prjReps.split(',').map(data => Number(data.trim()));

      // if(((empId == item.emiEmcEmpId && item.emiEmcIsApproved === 'N') || (empId == item.fwEmpId && item.fwIsApproved === 'N') || (empId == item.qaEmpId && item.qaIsApproved === 'N') || (empId == item.swEmpId && item.swIsApproved === 'N')) && empId !== 0){
      //     const memberTypes = committeMembersLinkedList.filter(data => data.irfId == item.docVersionReleaseId && data.empId == empId && data.approveType === 'F').map(data => data.memberType);
      //     fwdMemTypes.push(...memberTypes);
      //     isForwarded = true;
      // }
      // if(prjReps.includes(Number(empId)) && item.prIsApproved === 'N'){
      //     isForwarded = true;
      //     fwdMemTypes.push('PR');
      // }

      // if(((empId == item.emiEmcEmpId && item.emiEmcIsApproved === 'Y') || (empId == item.fwEmpId && item.fwIsApproved === 'Y') || (empId == item.qaEmpId && item.qaIsApproved === 'Y') || (empId == item.swEmpId && item.swIsApproved === 'Y')) && empId !== 0 && item.isVerified === 'N'){
      //     const memberTypes = committeMembersLinkedList.filter(data => data.irfId == item.docVersionReleaseId && data.empId == empId).map(data => data.memberType);
      //     revMemTypes.push(...memberTypes);
      //     isRevoke = true;
      // }
      // if(prjReps.includes(Number(empId)) && item.prIsApproved === 'Y'&& item.isVerified === 'N'){
      //     isRevoke = true;
      //     revMemTypes.push('PR');
      // }
      // if(item.isForwarded === 'Y'){
      //     if(((empId == item.pdEmpId && item.pdVerified === 'N') || (empId == item.gdDhqaEmpId && item.gdDhqaVerified === 'N') || (empId == item.gdDsqaEmpId && item.gdDsqaVerified === 'N')) && empId !== 0){
      //         const memberTypes = committeMembersLinkedList.filter(data => data.irfId == item.docVersionReleaseId && data.empId == empId && data.approveType === 'V').map(data => data.memberType);
      //         verMemTypes.push(...memberTypes);
      //         isVerified = true;
      //         isReturn = true;
      //     }
      // }
      // if(item.isApproved === 'Y'){
      //     if(((empId == item.adQaEmpId && item.adQaVerified === 'N') || (empId == item.gdAqaEmpId && item.gdAqaVerified === 'N')) && empId !== 0){
      //         const memberTypes = committeMembersLinkedList.filter(data => data.irfId == item.docVersionReleaseId && data.empId == empId && data.approveType === 'A').map(data => data.memberType);
      //         verMemTypes.push(...memberTypes);
      //         isApproved = true;
      //         isReturn = true;
      //     }
      // }
      let statusColor = `${item.statusCode === 'INITIATION'?'initiated' : (['Proj-Rep FORWARDED','QA-Rep FORWARDED','EMC-Rep FORWARDED','S/W-Rep FORWARDED','F/W-Rep FORWARDED'].includes(item.statusCode) ? 'forwarde' : ['Proj-Rep REVOKED','QA-Rep REVOKED','EMC-Rep REVOKED','S/W-Rep REVOKED','F/W-Rep REVOKED'].includes(item.statusCode)?'revoked':['PD VERIFIED','GD-DHQA VERIFIED','GD-DSQA VERIFIED'].includes(item.statusCode)?'verified':['PD RETURNED','GD-DHQA RETURNED','GD-DSQA RETURNED','AD-QA RETURNED','GD-AQA RETURNED'].includes(item.statusCode)?'returned':'approved')}`;

      return {
          sn: index + 1,
          docType: item.docType || '-',
          particulars: item.particulars || '-',
          // from: 'V' + item[5] + '-R' + item[6] || '-',
          from: index+1 < userManualDocVersionListByProject.length ? 'V'+userManualDocVersionListByProject[index+1].versionNo+'-R'+userManualDocVersionListByProject[index+1].releaseNo : '--',
          to: 'V' + item.versionNo + '-R' + item.releaseNo || '-',
          issueDate: format(new Date(item.issueDate), 'dd-MM-yyyy') || '-',
          // onClick = {()=>openTran(item)}
          status: <Box className={statusColor} >
            <Box className='status'>{item.statusName}
              {/* <i className="material-icons float-right font-med">open_in_new</i> */}
              </Box></Box>|| '-',
          action: (
              <Grid>
                {/* if not approved then only allow to edit */}
                 {!["APPROVED"].includes(item.statusCode) && (
                  <>
                 <IconButton className="edit-icon"
                     title="Edit" style={{marginRight: '1rem'}}
                     onClick={() => redirectToUserManualDocumentEditor(item)} 
                     >
                     <i className="material-icons edit-icon"  >edit_note</i>
                </IconButton>

                          {/* {getDocPDF(item.docType.split('-')[0], item)} */}
                          {/* <IconButton style={{ color: '#9683EC', marginLeft: '1rem' }} onClick={() => {
                              setOpenDialog2(true);
                              setSingleDoc(item);
                          }} title="Document Summary"> <i className="material-icons" >summarize</i>
                          </IconButton> */}
                         
                          
                          
                           {/* <IconButton className="distribution-icon mgl15 button-margin" onClick={() => openDocDist()} title="Distribution List" ><MdFeaturedPlayList /></IconButton> */}
                       
                     
                          {/* <button
                              style={{ background: "transparent",color: "blue", fontSize: "12px",cursor: "pointer",padding: "5px", border: "none",outline: "none" }}
                              className="btn btn-outline-primary btn-sm me-0"
                              onClick={() => wordConversion(item.docType.split("-")[0], item)}
                              title="Word"
                          >
                          <i>
                              <FaFileWord style={{ width: '20px', height: '20px', color: 'inherit',marginTop: '-5px' }} />
                          </i>
                          </button> */}
                 
                     
                
                          {/* {(isForwarded) && <IconButton id="iconButtons" onClick={() => docForward(item,isForwarded,fwdMemTypes,gdDhqa,gdDsqa,adQa)} title="Forward"> <i className="material-icons fwdButton" >double_arrow</i></IconButton>}
                          {(isVerified) && <IconButton id="iconButtons" onClick={() => docVerfify(item,verMemTypes,isVerified,isApproved)} title="Verify"> <i className="material-icons fwdButton" >double_arrow</i></IconButton>}
                          {isApproved && <IconButton id="iconButtons" onClick={() => docVerfify(item,verMemTypes,isVerified,isApproved)} title="Approve"><i className="pi pi-check-circle button-margin mgl10 fwdButton"></i></IconButton>}
                          {isRevoke && <IconButton id="iconButtons" onClick={() => docRevoke(item,revMemTypes)} title="Revoke"> <i className="material-icons revokeBtn"  >double_arrow</i></IconButton>}
                          {isReturn && <IconButton id="iconButtons" onClick={() => docReturn(item,verMemTypes)} title="Return"><FaArrowAltCircleLeft className="return-btn button-margin mgl10" /></IconButton>}
                          {haveRemarks && <IconButton id="iconButtons" onClick={() => docRemarks(item.docVersionReleaseId)} title="Remarks"><img src={RemarksIcon} className='editStyles mgl10 mgb5' /></IconButton>}
                      */}
                  </>
                  )}
                  {/* {["AD-QA APPROVED", "GD-AQA APPROVED"].includes(item.statusCode) && <>
                      <IconButton id="iconButtons" style={{ color: '#6e78ff' }} onClick={() => generateDocPdf(item)} title="QAQT Docs Print"><PrintIcon  /></IconButton>
                      {index === 0 && <IconButton id="iconButtons" style={{ color: 'darkorange' }} className="mgl10" onClick={() => docAmend(item)} title="Amend"><MdNoteAlt   /></IconButton>}
                  </>}  */}
              </Grid>
          ),
      }
});
};







switch (status) {
  case 'userManualDocContent':
    return <UserManualAddDocContentEditorComponent versionElements={versionElementData} ></UserManualAddDocContentEditorComponent>;
    default:
      return (

    <Box className="card">
      <Navbar />
      <Box className="card-body">

        <Box className="row">
        <Grid container alignItems="center" justifyContent={"flex-start"} spacing={2}>
   
          <Grid item xs={9} sx={{ textAlign: "left" }}>
              <h3 style={{ margin: 0, color:'#484848'}}>User Manual Record</h3>
          </Grid>
         
          <Grid item xs={3}>
            <Formik enableReinitialize initialValues={initialValueOfProjectSel}>
              {({ setFieldValue, values, errors }) => (
                <Form>
                  <Field name="projectId">
                    {({ field, form }) => (
                      <Autocomplete
                        options={filteredProjectList}
                        getOptionLabel={(option) => `${option.projectCode}, ${option.projectShortName}`}
                        renderOption={(props, option) => (
                          <CustomMenuItem {...props} key={option.projectId}>
                            <ListItemText
                              primary={`${option.projectCode} - ${option.projectShortName}`}
                            />
                          </CustomMenuItem>
                        )}
                        value={
                          filteredProjectList.find(
                            (ls) => Number(ls.projectId) === Number(values.projectId)
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          const selectedValue = newValue || "";
                          setFieldValue("projectId", selectedValue.projectId || "");
                          handleProjectFieldChange(
                            "projectId",
                            selectedValue.projectId || "",
                            values
                          );
                          setCurrentSelectProjectName(newValue ? newValue[1] : "");
                        }}
                        filterOptions={(options, state) =>
                          options.filter(
                            (option) =>
                              option.projectShortName
                                .toLowerCase()
                                .includes(state.inputValue.toLowerCase()) ||
                              option.projectCode
                                .toLowerCase()
                                .includes(state.inputValue.toLowerCase())
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Project Code - Project Short Name"
                            error={Boolean(errors.projectId)}
                            helperText={errors.projectId}
                            margin="normal"
                            required
                            InputProps={{
                              ...params.InputProps,
                              sx: { height: 40, padding: "8px 14px" },
                            }}
                          />
                        )}
                        ListboxProps={{
                          sx: {
                            maxHeight: 200,
                            overflowY: "auto",
                          },
                        }}
                        disableClearable
                      />
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Box>

        <br />

        <Box id="card-body customized-card">
          {isLoading ? (
            <h3>Loading...</h3>
          ) : error ? (
            <h3 color="error">{error}</h3>
          ) : (
            <Datatable columns={columns} data={getMappedData()} />
          )}
        </Box>

        <br />
        <Box textAlign="center">
                        {/* {roleData.length > 0 && roleData[0][7] === "Y" &&  */}
                            {userManualDocVersionListByProject.length === 0 && filteredProjectList.length > 0 && (
                                <Button
                                    variant="contained"
                                    className="add"
                                    onClick={() => addNewVersion()}
                                >
                                    Add Issue (V1-R0)
                                </Button>
                            )
                          }
                        {/* } */}
                    </Box><br />

      </Box>
      <UserManualDocAddIssueDialog
       open={openAddNewVersDialog}
       onClose={handleCloseAddNewVersDialog}
       versionElements={singleDoc}
       projectId={initialValueOfProjectSel.projectId}
       currentSelectProjectName={currentSelectProjectName}
       onConfirm={handleAddIssueConfirm}
       //existingMqap = {mqapExitingProjects} 
       //platform = {radarType[projectPlatform]}
/>
    </Box>







);
};
}

export default withRouter(UserManualDocRecordsComponent);