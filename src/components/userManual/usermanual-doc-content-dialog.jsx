import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  IconButton,
  Box
} from "@mui/material";
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import AlertConfirmation from "common/AlertConfirmation.component";
import { addUserManualTableContent, updateUserManualTableContent } from "services/usermanual.service";

const validationSchema = Yup.object().shape({
    rows: Yup.array().of(
      Yup.object().shape({
        contentName: Yup.string().required("Required"),
        contentDescription: Yup.string().required("Required"),
        contentPageNo: Yup.number()
          .typeError("Must be a number")
          .integer("Must be an integer")
          .positive("Must be a positive number")
          .required("Required"),
      })
    ),
  });

const UserManualDocContentDialog = ({ open, onClose, qaqtDocData, type, fetchData, editData }) => {


const [isEditMode, setIsEditMode] = useState(false);



useEffect(() => {
    if (editData && editData.length > 0) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [editData]);

const handleDialogConfirm = async (formValues) => {
  const confirm = await AlertConfirmation({
    title: isEditMode ? "Are you sure you want to update?" : "Are you sure to submit?",
    message: "",
  });

  if (!confirm) return;

  if (!formValues || formValues.length === 0) return;

  onClose();

  let result;
  if (isEditMode) {
    const dto = {
      contentId: formValues[0]?.contentId || null,
      contentName: formValues[0]?.contentName || "",
      contentDescription: formValues[0]?.contentDescription || "",
      contentPageNo: formValues[0]?.contentPageNo || 0,
      docType: qaqtDocData?.docType || "",
      projectType: qaqtDocData?.projectType || "",
      projectId: qaqtDocData?.projectId || 0,
      subSystemId: qaqtDocData?.subSystemId || 0,
      contentType: type || "",
    };
    result = await updateUserManualTableContent(dto);
  } else {
    const dtoArray = formValues.map((item) => ({
      contentName: item.contentName || "",
      contentDescription: item.contentDescription || "",
      contentPageNo: item.contentPageNo || 0,
      docType: qaqtDocData?.docType || "",
      projectType: qaqtDocData?.projectType || "",
      projectId: qaqtDocData?.projectId || 0,
      subSystemId: qaqtDocData?.subSystemId || 0,
      contentType: type || "",
    }));
    result = await addUserManualTableContent(dtoArray);
  }

  if (result > 0) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: isEditMode ? "Content updated successfully!" : "Content added successfully!",
      showConfirmButton: false,
      timer: 2600,
    });
    fetchData();
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: isEditMode ? "Content update failed!" : "Content add unsuccessful!",
      showConfirmButton: false,
      timer: 2600,
    });
  }
};


  return (
    <Box>
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
     PaperProps={{
        style: {
          position: "absolute",
          top: "5%",
        },
      }}>
    <DialogTitle>{isEditMode ? "Edit" : "Add"} {type === "T" ? "Table" : "Figure"} Content</DialogTitle>
    <Formik
        initialValues={{
            rows: editData && editData.length > 0
            ? editData.map(item => ({
                contentId: item.contentId || null,
                contentName: item.contentName || "",
                contentDescription: item.contentDescription || "",
                contentPageNo: item.contentPageNo || "",
                }))
            : [{ contentName: "", contentDescription: "", contentPageNo: "" }],
        }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleDialogConfirm(values.rows);
      }}
    >
      {({ values, errors, touched }) => (
        <Form>
          <DialogContent>
          <FieldArray name="rows">
            {({ push, remove }) => (
                <>
                {values.rows.map((_, index) => (
                    <div
                    key={index}
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "10px",
                    }}
                    >
                    {/* Content Name */}
                    <Field
                        as={TextField}
                        name={`rows.${index}.contentName`}
                        label="Content Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        style={{ flex: 1 }}
                        error={touched.rows?.[index]?.contentName && Boolean(errors.rows?.[index]?.contentName)}
                        helperText={touched.rows?.[index]?.contentName && errors.rows?.[index]?.contentName}
                    />

                    {/* Content Description (Bigger) */}
                    <Field
                        as={TextField}
                        name={`rows.${index}.contentDescription`}
                        label="Content Description"
                        variant="outlined"
                        size="small"
                        fullWidth
                        style={{ flex: 2 }}
                        error={touched.rows?.[index]?.contentDescription && Boolean(errors.rows?.[index]?.contentDescription)}
                        helperText={touched.rows?.[index]?.contentDescription && errors.rows?.[index]?.contentDescription}
                    />

                    {/* Page Number (Smaller) */}
                    <Field
                        as={TextField}
                        name={`rows.${index}.contentPageNo`}
                        type="number"
                        label="Page No"
                        variant="outlined"
                        size="small"
                        fullWidth
                        style={{ flex: 1 }}
                        error={touched.rows?.[index]?.contentPageNo && Boolean(errors.rows?.[index]?.contentPageNo)}
                        helperText={touched.rows?.[index]?.contentPageNo && errors.rows?.[index]?.contentPageNo}
                    />

                    {/* Add Button */}
                    {!isEditMode &&
                    <Button
                        startIcon={<FaPlus />}
                        onClick={() => push({ contentName: "", contentDescription: "", contentPageNo: "" })}
                    >
                    </Button>
                    }

                    {/* Remove Button (Only if more than one row exists) */}
                    {!isEditMode && values.rows.length > 1 && (
                        <IconButton color="secondary" onClick={() => remove(index)}>
                        <FaMinus />
                        </IconButton>
                    )}
                    </div>
                ))}
                </>
            )}
            </FieldArray>
            <Box className="text-center mt-4">
                <Button className="me-2" type="submit" variant="contained" color="success">
                    {isEditMode ? "Update" : "Submit"}
                </Button>
                <Button onClick={onClose} variant="contained" color="error">
                   Cancel
                </Button>
            </Box>
          </DialogContent>
        </Form>
      )}
    </Formik>
  </Dialog>
 
  </Box>
  );
};

export default UserManualDocContentDialog;
