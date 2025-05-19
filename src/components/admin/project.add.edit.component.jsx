import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format,isAfter, parse ,isEqual} from 'date-fns';
import Project from "components/admin/project.component";
import './master.css';
import AlertConfirmation from "common/AlertConfirmation.component";
import { addProject, getEmployeeMasterList,updateProject } from "services/admin.serive";
import { Helmet } from "react-helmet";
import Navbar from "components/navbar/Navbar";
const ProjectAddEdit = ({mode,projectMasterData}) => { 

    const [empList,setEmpList] = useState([]);
    const [status, setStatus] = useState('');


   
    const [formData, setFormData] = useState({  

        projectId:null,
        projectCode:"",
        projectName:"",
        projectShortName:"",
        projectDescription:"",

    });

    useEffect(() => {
      if (projectMasterData) {
        setFormData({
          projectId: projectMasterData.projectId || null,
          projectCode: projectMasterData.projectCode || "",
          projectName: projectMasterData.projectName || "",
          projectShortName: projectMasterData.projectShortName || "",
          projectDescription: projectMasterData.projectDescription || "",
        });
      }
    }, [projectMasterData]);
    

    const getEmployeeMaster = async () => {
        try {
          const data = await getEmployeeMasterList();
    
          setEmpList(
            data.map((emp)=>({
                  value: emp.empId,
                  empNo: emp.empNo,
                  label: `${emp.salutation ? emp.salutation + " " : emp.title ? emp.title + " " : ""}${emp.empName}, ${emp.empDesigName}`,
              })
          ));


        } catch (err) {
          
        }
      };





      useEffect(() => {
        getEmployeeMaster();
      }, []);


      const validationSchema = () =>
        Yup.object().shape({
           projectCode: Yup.string().required('Project Code is required'),
           projectName: Yup.string().required('Project Name is required'),
           projectDescription: Yup.string().required('Project Description is required'),
           projectShortName: Yup.string().required('Project Short Name is required'),
        });


      const handleSubmit = async(values) =>{


        const submitData = {
            ...values,
        };



       const confirm = await AlertConfirmation({
           title: mode === 'add' ? 'Are you sure you want to Add?' : 'Are you sure you want to update?',
            message: '',
        });
        if (confirm) {
          if(mode==='add' ){
            const response = await addProject(submitData);
            if(response.projectId>0){
                  Swal.fire({
                        icon: "success",
                        title: 'Success',
                        text: `Project added successfully`,
                        showConfirmButton: false,
                        timer: 2600
                    });      
     
              
            }else{
                  Swal.fire({
                        icon: "error",
                        title: 'Error',
                        text: `Project Add Unsuccessful!`,
                        showConfirmButton: false,
                        timer: 2600
                    });      
            }
            
          }
          else if(mode==='edit'){
            const response = await updateProject(submitData);
            if(response.projectId>0){
                      Swal.fire({
                        icon: "success",
                        title: 'Success',
                        text: `Project updated successfully`,
                        showConfirmButton: false,
                        timer: 2600
                    });     
              
            }else{
                 Swal.fire({
                        icon: "error",
                        title: 'Error',
                        text: `Project Update Unsuccessful!`,
                        showConfirmButton: false,
                        timer: 2600
                    });   
            }
            
          }
          setStatus('list');
        }
      
      
        
      }

      const getMinDate = () => {
        const currentDate = new Date();
        const minYear = currentDate.getFullYear() - 20;
        return new Date(minYear, currentDate.getMonth(), currentDate.getDate());
      };
    
      const getMaxDate = () => {
        const currentDate = new Date();
        const maxYear = currentDate.getFullYear() + 50;
        return new Date(maxYear, currentDate.getMonth(), currentDate.getDate());
      };

      const redirectProjectList = () =>{
        setStatus('list')
      }


      switch (status) {
        case 'list':
        return <Project></Project>;
        default:
       return (
           <div>
             <Navbar></Navbar>
              <Helmet>
                <title>VDP - Project Master</title>
            </Helmet>
    <div className="card"></div>
      <div className="expert-form-container">
      <div className="form-card">
    
        <Formik
         initialValues={formData}
         validationSchema={validationSchema()}
         onSubmit={(values) => handleSubmit(values)}
         enableReinitialize={true}
        >
            {({
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
          }) => {
            const reCost =
            !isNaN(parseFloat(values.totalSanctionCost)) &&
            !isNaN(parseFloat(values.sanctionCostFE))
              ? (parseFloat(values.totalSanctionCost) -
                  parseFloat(values.sanctionCostFE)).toFixed(2)
              : "0.00";

            return (
              <Form>
              <div className="row">

                
              <div className="col-md-4">
                            <div className="form-group-project">
                                <label >Project Code: <span className="text-danger">*</span></label>
                                <Field
                                type="text"
                                name="projectCode"
                                className="form-control-project mb-2"
                                placeholder="Enter Project Code"
                                maxLength="20"
                                minLength="3"
                              
                                />
                                <ErrorMessage name="projectCode" component="div" className="text-danger" />
                            </div>
                            </div>


                            <div className="col-md-4">
                            <div className="form-group-project">
                                <label >Project Name: <span className="text-danger">*</span></label>
                                <Field
                                type="text"
                                name="projectName"
                                className="form-control-project mb-2"
                                placeholder="Enter Project Name"
                                maxLength="255"
                                minLength="3"
                              
                                />
                                <ErrorMessage name="projectName" component="div" className="text-danger" />
                            </div>
                            </div>

                  
                 

                        <div className="col-md-4">
                            <div className="form-group-project">
                                <label >Project Short Name: <span className="text-danger">*</span></label>
                                <Field
                                type="text"
                                name="projectShortName"
                                className="form-control-project mb-2"
                                placeholder="Enter Project ShortName"
                                maxLength="255"
                                minLength="3"/>
                                <ErrorMessage name="projectShortName" component="div" className="text-danger" />
                            </div>
                            </div>
                                      </div>

                                       <div className="col-md-12">
                            <div className="form-group-project">
                                <label >Project Description: <span className="text-danger">*</span></label>
                                <Field
                                type="text"
                                name="projectDescription"
                                className="form-control-project mb-2"
                                placeholder="Enter Project Description"
                                maxLength="100"
                                minLength="3"
                              
                                />
                                <ErrorMessage name="projectDescription" component="div" className="text-danger" />
                            </div>
                            </div>
  
                            
                  <div align="center">
                    <button
                      type="submit"
                      className={`btn ${
                        mode === "add" ? "submit" : "edit"
                      } mt-3`}
                      disabled={isSubmitting}
                    >
                      {mode === "add" ? "SUBMIT" : "UPDATE"}
                    </button>

                    <button className="btn back mt-3" onClick={() => redirectProjectList()}>BACK</button>
                  </div>
          
              </Form>
            );
          }}
                        </Formik>
                        </div>
                        </div>
                        </div>
                        
    );
  }
}

export default ProjectAddEdit;