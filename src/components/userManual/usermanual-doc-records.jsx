import { useEffect, useState, useCallback } from "react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box, Button, IconButton, TextField, Grid, Autocomplete, ListItemText } from '@mui/material';
import { Field, Form, Formik } from "formik";
import { format } from "date-fns";
import withRouter from "../../common/with-router";
import Navbar from "components/navbar/Navbar";
import Datatable from "components/datatable/Datatable";
import { CustomMenuItem } from "services/auth.header";
import { getEmployeeMasterList, getProjectMasterList } from 'services/admin.serive';
import { getAllUserManualDocVersionDtoListByProject, getUserManualDocTransactionList } from "services/usermanual.service";
import UserManualDocAddIssueDialog from 'components/userManual/usermanual-add-isssue-dialog';
import UserManualAddDocContentEditorComponent from 'components/userManual/usermanual-add-content-editor';
import UserManualDocPrint from "./usermanual-doc-print";
import { FaFileWord } from "react-icons/fa";
import UserManualDocHtmlComponent from "./usermanual-doc-html";
import UserManualForwardComponent from "./usermanual-forward-version-dialog.component";

const UserManualDocRecordsComponent = ({ props }) => {

  const wordConversion = (data) => {
    const componentId = 'user-manual-document-html';
    let ComponentToRender = UserManualDocHtmlComponent;
    const container = document.createElement("div");
    container.id = componentId;
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(
      <ComponentToRender
        revisionElements={data}
        printType={'word'}
        id={componentId}
        key={componentId}
      />
    );
  };

  const [isReady, setIsReady] = useState(false);
 
  const selectedempId = localStorage.getItem('empId');
  //const selectedroleId = localStorage.getItem('roleId');
  const [status, setStatus] = useState('');
 
  const [initialValueOfProjectSel, setInitialValueOfProjectSel] = useState({
    projectId: props?.projectId || '',
  });

  const getDocPDF = (versionElements) => {
    return <UserManualDocPrint action='' revisionElements={versionElements} buttonType={'Button'} />;
  };

  const [fullProjectList, setFullProjectList] = useState([]);
  const [currentSelectProjectName, setCurrentSelectProjectName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState([]);
   //const [docTrans, setDocTrans] = useState([])
  const [filteredProjectList, setFilteredProjectList] = useState([]);
  const [userManualVersionListRefresh, setUserManualVersionListRefresh] = useState('');
  const [userManualDocVersionListByProject, setUserManualDocVersionListByProject] = useState([]);
  const [userManualDocTrans, setUserManualDocTrans] = useState([]);
  const [versionElementData, setVersionElementData] = useState(null);
  const [singleDoc, setSingleDoc] = useState([]);
  const [openAddNewVersDialog, setOpenAddNewVersDialog] = useState(false);
  const [empId, setEmpId] = useState(0);
  const [empList, setEmpList] = useState([]);
  const [forwardDialogue, setforwardDialogue] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalStatus, setModalStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectToUserManualDocumentEditor = useCallback((element) => {
    setStatus('userManualDocContent');
    setVersionElementData(element);
  }, []);

  const addNewVersion = () => {
     setOpenAddNewVersDialog(true);
   };

  const addRevisionVersion=(item)=>{
    setSingleDoc(item); // Pass the selected version data
  setOpenAddNewVersDialog(true); // Open same modal
  }

  const handleCloseForwardModal = () => {
    setSelectedRow(null);
    setforwardDialogue(false);
  };

  const openModal = (proejctiD, row) => {
    setSelectedRow(row.docVersionReleaseId);
    setforwardDialogue(true);
    setModalStatus("FORWARD");
  };

  const openReviewModal = (proejctiD, row) => {
    localStorage.setItem('UMPreviewData', JSON.stringify({ row, mode: 'approvalPending' }));
    window.open('/userManualPreview', '_self');
  };

  const openApprovedModal = (proejctiD, row) => {
    localStorage.setItem('UMPreviewData', JSON.stringify({ row, mode: 'approvalPending' }));
    window.open('/userManualApproved', '_self');
  };

  const handleCloseAddNewVersDialog = () => {
    setOpenAddNewVersDialog(false);
    setSingleDoc([]);
    setUserManualVersionListRefresh(!userManualVersionListRefresh);
  };

  const handleAddIssueConfirm = async (response) => {
    if (response.docVersionReleaseId > 0) {
      const docTrans = await getUserManualDocTransactionList();
      setUserManualDocTrans(docTrans);
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
  };

  useEffect(() => {
    fetchInitialUserManualDocData();
  }, [isReady]);

  const fetchInitialUserManualDocData = async () => {
    const employeeList = await getEmployeeMasterList();
    const docTrans = await getUserManualDocTransactionList();
    setUserManualDocTrans(docTrans);
    const empId = localStorage.getItem('empId');
    setEmpId(empId);
    const filEmp = employeeList.map(item => ({
      value: item.empId,
      label: item.empName + ', ' + item.empDesigCode
    }));
    setEmpList(filEmp);
    setIsReady(true);
  };

// ✅ Load saved project from localStorage before fetchData runs
useEffect(() => {
  const savedProjectId = localStorage.getItem("selectedProjectId");
  if (savedProjectId && !initialValueOfProjectSel.projectId) {
    setInitialValueOfProjectSel({ projectId: savedProjectId });
    setSelectedProjectId(savedProjectId);
  }
}, []);




  useEffect(() => {
    fetchData();
  }, [initialValueOfProjectSel.projectId]);

  useEffect(() => {
    fetchUserManualDocVersionData();
  }, [initialValueOfProjectSel.projectId, userManualVersionListRefresh]);

  const fetchUserManualDocVersionData = async () => {
    try {
      const projectSelDto = {
        projectId: initialValueOfProjectSel.projectId,
      };
      const UserManualocVersionListByProject = await getAllUserManualDocVersionDtoListByProject(projectSelDto);
      setUserManualDocVersionListByProject(UserManualocVersionListByProject);
    } catch (error) {
      setError('An error occurred');
      setIsLoading(false);
    }
  };


  const fetchData = async () => {
  try {
    let projectId = localStorage.getItem("selectedProjectId") || initialValueOfProjectSel.projectId;
    let ProjectList = await getProjectMasterList();
    setFullProjectList(ProjectList);

    const projectListArray = ProjectList.map(obj => ({
      projectId: obj.projectId,
      projectName: obj.projectName,
      projectCode: obj.projectCode,
      platform: obj.platform,
      projectShortName: obj.projectShortName
    }));

    // ✅ If no projectId found, fallback to first
    if (projectListArray.length > 0 && !projectId) {
      projectId = projectListArray[0].projectId;
    }

    setFilteredProjectList(projectListArray);
    setSelectedProjectId(projectId);
    setInitialValueOfProjectSel({ ...initialValueOfProjectSel, projectId });
    setIsLoading(false);
  } catch (error) {
    setError('An error occurred');
    setIsLoading(false);
  }
};

  

  // const fetchData = async () => {
  //   try {
  //     let projectId = initialValueOfProjectSel.projectId;
  //     let ProjectList = await getProjectMasterList();
  //     setFullProjectList(ProjectList);

  //     const projectListArray = ProjectList.map(obj => ({
  //       projectId: obj.projectId,
  //       projectName: obj.projectName,
  //       projectCode: obj.projectCode,
  //       platform: obj.platform,
  //       projectShortName: obj.projectShortName
  //     }));

  //     if (projectListArray.length > 0 && projectId === '') {
  //       projectId = projectListArray[0].projectId;
  //     }

  //     setFilteredProjectList(projectListArray);
  //     setSelectedProjectId(projectId);
  //     setInitialValueOfProjectSel({ ...initialValueOfProjectSel, projectId: projectId });
  //     setIsLoading(false);
  //   } catch (error) {
  //     setError('An error occurred');
  //     setIsLoading(false);
  //   }
  // };

  const handleProjectFieldChange = async (field, value, values) => {
    const newValues = { ...values, [field]: value };
    setInitialValueOfProjectSel({
      ...initialValueOfProjectSel,
      projectId: newValues.projectId
    });
    setSelectedProjectId(newValues.projectId);

     // ✅ Save project ID in localStorage
  localStorage.setItem("selectedProjectId", newValues.projectId);
  };

   const openTran =  (item) => {
        localStorage.setItem('docData', JSON.stringify(item));
         
        const trans = userManualDocTrans.filter(data => data.docVersionReleaseId == item.docVersionReleaseId)?.reverse();
        localStorage.setItem('transaction', JSON.stringify(trans));
        window.open('/docs-trans', '_blank');
    }



  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%' },
    { name: 'Particulars', selector: (row) => row.particulars, sortable: true, grow: 2, width: '18%' },
    { name: 'From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center', width: '8%' },
    { name: 'To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center', width: '8%' },
    { name: 'Issue Date', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center', width: '10%' },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center', width: '18%' },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center', width: '22%' },
  ];

  const getMappedData = () => {
    return userManualDocVersionListByProject.map((item, index) => {
      let haveRemarks = false;
      const remarks = userManualDocTrans.filter(data => data.docVersionReleaseId === item.docVersionReleaseId && data.attachmentName !== '');
      if (remarks.length > 0) haveRemarks = true;

      const statusColor = item.statusCode === 'INITIATION' ? 'initiated' :
        ['FORWARD','RECOMMEND'].includes(item.statusCode) ? 'forwarde' :
          ['REVOKE'].includes(item.statusCode) ? 'revoked' :
            ['APPROVE'].includes(item.statusCode) ? 'verified' :
              ['RETURN'].includes(item.statusCode) ? 'returned' 
              
              : 'approved';

      return {
        sn: index + 1,
        docType: item.docType || '-',
        particulars: item.particulars || '-',
        from: index + 1 < userManualDocVersionListByProject.length ? 'V' + userManualDocVersionListByProject[index + 1].versionNo + '-R' + userManualDocVersionListByProject[index + 1].releaseNo : '--',
        to: 'V' + item.versionNo + '-R' + item.releaseNo || '-',
        issueDate: format(new Date(item.issueDate), 'dd-MM-yyyy') || '-',
        status: <Box className={statusColor} onClick={() => openTran(item)}  ><Box className='status'>{item.statusName}<i className="material-icons float-right font-med">open_in_new</i></Box></Box> || '-',
        action: (
          <Grid>
            {/* Edit button: Only for INITIATION or RETURN */}
            {["INITIATION", "RETURN"].includes(item.statusCode?.trim()) &&
              Number(item.preparedBy) === Number(localStorage.getItem('empId')) && (
                <IconButton className="edit-icon" title="Edit" style={{ marginRight: '1rem' }} onClick={() => redirectToUserManualDocumentEditor(item)}>
                  <i className="material-icons edit-icon">edit_note</i>
                </IconButton>
              )}

            {/* PDF button (always visible) */}
            {getDocPDF(item)}

            {/* Word button (always visible) */}
            <button
              style={{ background: "transparent", color: "blue", fontSize: "12px", cursor: "pointer", padding: "5px", border: "none", outline: "none" }}
              className="btn btn-outline-primary btn-sm me-0"
              onClick={() => wordConversion(item)}
              title="Word"
            >
              <i>
                <FaFileWord style={{ width: '20px', height: '20px', color: 'inherit', marginTop: '-5px' }} />
              </i>
            </button>

            {/* Forward button */}
            {(item.statusCode?.trim() === "INITIATION" ) && Number(item.preparedBy) === Number(localStorage.getItem('empId')) && (
              <IconButton id="iconButtons" title="Forward" onClick={() => openModal(item.setSelectedProjectId, item)}>
                <i className="material-icons fwdButton">double_arrow</i>
              </IconButton>
            )}

            {/* Review button */}
            {(item.statusCode?.trim() === "FORWARD" ||item.statusCode?.trim() === "REFORWARD") && Number(item.reviewBy) === Number(localStorage.getItem('empId')) && (
              <IconButton id="iconButtons" title="Review By" onClick={() => openReviewModal(item.setSelectedProjectId, item)}>
                <i className="material-icons fwdButton">double_arrow</i>
              </IconButton>
            )}

            {/* Approved button */}
            {item.statusCode?.trim() === "RECOMMEND" && Number(item.verifyBy) === Number(localStorage.getItem('empId')) && (
              <IconButton id="iconButtons" title="Approve By" onClick={() => openApprovedModal(item.setSelectedProjectId, item)}>
                <i className="material-icons approveButton fwdButton">check_circle</i>
              </IconButton>
            )}
             
               {item.statusCode?.trim() === "APPROVED" && index === 0 && (
              <IconButton id="iconButtons" title="Amend" onClick={() => addRevisionVersion(item)}>
                <i className="material-icons amendIcon">note_alt</i>
              </IconButton>
            )}

              {/* Return button */}
               {item.statusCode?.trim() === "RETURN" && Number(item.preparedBy) === Number(localStorage.getItem('empId')) && (
              <IconButton id="iconButtons" title="ReForward " onClick={() => openReviewModal(item.setSelectedProjectId, item)}>
                <i className="material-icons fwdButton">double_arrow</i>
              </IconButton>
            )}



          </Grid>
        ),
      };
    });
  };

  switch (status) {
    case 'userManualDocContent':
      return <UserManualAddDocContentEditorComponent versionElements={versionElementData} />;
    default:
      return (
        <Box className="card">
          <Navbar />
          <Box className="card-body">
            <Grid container alignItems="center" justifyContent="flex-start" spacing={2}>
              <Grid item xs={9} sx={{ textAlign: "left" }}>
                <h3 style={{ margin: 0, color: '#484848' }}>User Manual Record</h3>
              </Grid>
              <Grid item xs={3}>
                <Formik enableReinitialize initialValues={initialValueOfProjectSel}>
                  {({ setFieldValue, values, errors }) => (
                    <Form>
                      <Field name="projectId">
                        {() => (
                          <Autocomplete
                            options={filteredProjectList}
                            getOptionLabel={(option) => `${option.projectCode}, ${option.projectShortName}`}
                            renderOption={(props, option) => (
                              <CustomMenuItem {...props} key={option.projectId}>
                                <ListItemText primary={`${option.projectCode} - ${option.projectShortName}`} />
                              </CustomMenuItem>
                            )}
                            value={filteredProjectList.find(ls => Number(ls.projectId) === Number(values.projectId)) || null}
                            onChange={(event, newValue) => {
                              const selectedValue = newValue || "";
                              setFieldValue("projectId", selectedValue.projectId || "");
                              handleProjectFieldChange("projectId", selectedValue.projectId || "", values);
                              setCurrentSelectProjectName(newValue ? newValue[1] : "");
                            }}
                            filterOptions={(options, state) =>
                              options.filter(
                                option =>
                                  option.projectShortName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                                  option.projectCode.toLowerCase().includes(state.inputValue.toLowerCase())
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
                                InputProps={{ ...params.InputProps, sx: { height: 40, padding: "8px 14px" } }}
                              />
                            )}
                            ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                            disableClearable
                          />
                        )}
                      </Field>
                    </Form>
                  )}
                </Formik>
              </Grid>
            </Grid>

            <Box id="card-body customized-card" mt={2}>
              {isLoading ? (
                <h3>Loading...</h3>
              ) : error ? (
                <h3 color="error">{error}</h3>
              ) : (
                <Datatable columns={columns} data={getMappedData()} />
              )}
            </Box>

            {/* <Box textAlign="center" mt={2}>
              {userManualDocVersionListByProject.length === 0 && filteredProjectList.length > 0 && (
                <Button variant="contained" className="add" onClick={() => addNewVersion()}>
                  Add Issue (V1-R0)
                </Button>
              )}
            </Box> */}

                <Box textAlign="center" mt={2}>
                  <Button variant="contained" className="add" onClick={() => addNewVersion()}>
                  Add Issue (V1-R0)
                </Button></Box>


          </Box>

          <UserManualDocAddIssueDialog
            open={openAddNewVersDialog}
            onClose={handleCloseAddNewVersDialog}
            versionElements={singleDoc}
            projectId={initialValueOfProjectSel.projectId}
            currentSelectProjectName={currentSelectProjectName}
            onConfirm={handleAddIssueConfirm}
          />

          <UserManualForwardComponent
            open={forwardDialogue}
            onClose={handleCloseForwardModal}
            projectId={initialValueOfProjectSel.projectId}
            loginId={selectedempId}
            rowData={selectedRow}
          />
        </Box>
      );
  }
};

export default withRouter(UserManualDocRecordsComponent);
