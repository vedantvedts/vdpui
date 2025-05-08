import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar, Alert, FormControl, InputLabel, Switch, Select, MenuItem, Stack, Typography, styled, FormHelperText } from '@mui/material';
import { Form, Formik } from "formik";
import * as Yup from "yup";
import AlertConfirmation from "common/AlertConfirmation.component";
import { addNewUserManualRelease } from "services/usermanual.service";

const UserManualDocAddIssueDialog = ({ open, onClose, versionElements,projectId,onConfirm}) => {
    const [error, setError] = useState(null);

    const [newAmendVersion, setNewAmendVersion] = useState('');
    //const [dataAddedTemplatesList, setDataAddedTemplatesList] = useState([]);
    const [initialValues, setInitialValues] = useState({
        isNewIssue: false,
        currentVersion: '',
        //copyTemplateFrom: '',
        amendParticulars: '',
    });
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            try {
                if(versionElements && versionElements.length != 0){
                    setInitialValues(prevValues =>({
                        ...prevValues,
                        currentVersion : 'V'+versionElements.versionNo+'-R'+versionElements.releaseNo,
                    }));
                    setNewAmendVersion('V'+versionElements.versionNo+'-R'+(versionElements.releaseNo+1));
            
                } else {
                    setInitialValues(prevValues =>({
                        ...prevValues,
                        currentVersion : 'V1-R0',
                    }));
                    setNewAmendVersion('V1-R0');
               }
                //setDataAddedTemplates();
           
            } catch (error) {
                setError('An error occurred');
            }
        }


        fetchData();
    }, [open]);

    // const setDataAddedTemplates = async () => {
    //     try {
    //         let list = await getDataAddedTemplates(docType);
    //         list =  list.filter(data => (data[1] === (docType+'-Template')) || (data[1] === (docType+'-'+platform)))
    //         setDataAddedTemplatesList(list);
    //     } catch (error) {
    //         setError('An error occurred');
    //     }
    // };

    const DialogTitleStyle = {
        backgroundColor: '#009cff', color: 'white'
    }


    
    const validationSchema = (val) => Yup.object().shape({
        amendParticulars : Yup.string()
        .required('Particulars is Required')
        .max(255,'Particulars must not exceed 255 characters'),
    });

    const handleSubmit = async (values) => {
        const  addVerionDto= {
            ...values,
            newAmendVersion: newAmendVersion,
            projectId: projectId,
        };
        setFormData(addVerionDto);
        const confirm = await AlertConfirmation({
            title: 'Are you sure to submit this form?',
            message: '',
        });
        if (confirm) {
            let response = await addNewUserManualRelease(addVerionDto);
            if (onConfirm) onConfirm(response);
            onClose(false)

        }
    };


    const onchangeIsNewIssue = (event) => {
        if (event.target.checked) {
            setNewAmendVersion(('V' + (versionElements.versionNo + 1) + '-R0'))
        } else {
            setNewAmendVersion(('V' + versionElements.versionNo + '-R' + (versionElements.releaseNo + 1)))
        }
    }


    
    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 32,
        height: 18,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#1890ff',
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#177ddc',
                    }),
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 14,
            height: 14,
            borderRadius: 7,
            transition: theme.transitions.create(['width'], {
                duration: 200,
            }),
        },
        '& .MuiSwitch-track': {
            borderRadius: 18 / 2,
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
            ...theme.applyStyles('dark', {
                backgroundColor: 'rgba(255,255,255,.35)',
            }),
        },
    }));

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle style={DialogTitleStyle} >Add Version/Release</DialogTitle>
            <br />
            <DialogContent>
                <Formik initialValues={initialValues} validationSchema={validationSchema(versionElements)} enableReinitialize onSubmit={handleSubmit}>
                    {({ setFieldValue, values, errors, isValid,touched, isSubmitting, dirty }) => (
                        <Form >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row g-3">
                                        <div className="col-md-2">
                                            <InputLabel shrink style={{ fontSize: 'large' }}>
                                                Is new issue?
                                            </InputLabel>
                                            <Stack direction="row" spacing={1} >
                                                <Typography>No</Typography>
                                                <AntSwitch  checked={values.isNewIssue} 
                                                disabled={!versionElements || versionElements.length === 0}
                                                onChange={(event, newValue) => {
                                                    setFieldValue(
                                                      "isNewIssue",
                                                      event.target.checked
                                                    );
                                                    onchangeIsNewIssue(event);
                                                  }} />
                                                <Typography>Yes</Typography>
                                            </Stack>
                                        </div >

                                        <div className="col-md-4">

                                            <TextField 
                                                label="Current Version"
                                                style={{ color: 'cadetblue', fontSize: 'large', fontWeight: 'bold' }}
                                                name="currentVersion"
                                                value={values.currentVersion}
                                                onChange={(event, newValue) => {
                                                    setFieldValue(
                                                      "currentVersion",
                                                      newValue ? newValue[0] : "",
                                                    );
                                                }}
                                                disabled
                                            />
                                        </div>

                                        {/* {versionElements.length===0 && docType === 'MQAP' && (
                                            <div className="col-md-5">
                                                <FormControl fullWidth error={Boolean(touched.copyTemplateFrom && errors.copyTemplateFrom)}>
                                                <InputLabel>Copy Template From</InputLabel>
                                                <Select
                                                    name="copyTemplateFrom"
                                                    label="Copy Template From"
                                                    value={values.copyTemplateFrom}
                                                    onChange={(event, newValue) => {
                                                        setFieldValue(
                                                            "copyTemplateFrom",
                                                            event.target.value
                                                        );
                                                    }}
                                                    required
                                                >
                                                    <MenuItem value="">Select</MenuItem>
                                                    {dataAddedTemplatesList && dataAddedTemplatesList.map((item1, index) => (
                                                    <MenuItem key={index} value={`${item1[1]}//Basic`}>
                                                        {item1[1]} Basic Template
                                                    </MenuItem>
                                                    ))}
                                                    {approvedVersionProjectList && approvedVersionProjectList.map((item, index) => (
                                                    <MenuItem key={index} value={`${item[0]}//${item[2]}//${item[1]}`}>
                                                        {item[3]} ({item[0]})
                                                    </MenuItem>
                                                    ))}
                                                    {existingMqap && (existingMqap || []).map((data,index) =>(
                                                        <MenuItem key={index} value={`P#${data.docType}#${data.projectId}`}>
                                                            {`${data?.projectMasterDto?.projectCode} - ${data.docType}`}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {touched.copyTemplateFrom && errors.copyTemplateFrom && (
                                                    <FormHelperText>{errors.copyTemplateFrom}</FormHelperText>
                                                )}
                                                </FormControl>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                                <div className="col-md-12 mt-3">
                                <FormControl fullWidth >
                                    <TextField
                                        label="Particulars" multiline rows={4}
                                        name="amendParticulars" 
                                        error={Boolean(touched.amendParticulars && errors.amendParticulars)} helperText={touched.amendParticulars && errors.amendParticulars}
                                        value={values.amendParticulars}
                                        onChange={(event, newValue) => {
                                            setFieldValue(
                                                "amendParticulars",
                                                event.target.value
                                            );
                                        }}
                                    />
                                </FormControl>
                                </div>
                            </div>


                            <input type="hidden" name="newAmendVersion" />
                            <div align='center'>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    disabled={!isValid || isSubmitting }
                                    className="btn submit my-3" 
                                >
                                    Document ({newAmendVersion})
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>


            </DialogContent>
            <DialogActions>
                <Button className="close-button closeButton fw-bolder" onClick={() => onClose(false)} color="error">
                    CLOSE
                    {/* <i className="material-icons">close</i> */}
                </Button>
            </DialogActions>

        </Dialog>

    );




};
    export default UserManualDocAddIssueDialog;