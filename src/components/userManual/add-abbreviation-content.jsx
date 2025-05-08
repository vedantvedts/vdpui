import withRouter from "common/with-router";
import Navbar from "components/Navbar/Navbar";
import React, { useEffect, useState } from 'react';
import './user-manual-add-doc-content.css';
import { FaTrash } from "react-icons/fa";
import { Alert, Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Snackbar, TextField, Typography } from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import * as Yup from "yup";
import UserManualAddDocContentEditorComponent from 'components/userManual/usermanual-add-content-editor';
import { addNewAbbreviationList, getAllAbbreviations, getNotReqAbbreviationIds, updateNotReqAbbreviationIds } from "services/usermanual.service";
import AlertConfirmation from "common/AlertConfirmation.component";

const AbbreviationMaster = (props)=>{

const {router} = props;
const {navigate} = router;
const revisionData = props?.versionElements;
const docRevId = revisionData.docVersionReleaseId;
const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const [filteredLetter, setFilteredLetter] = useState("");
const [allAbbreviationList, setAllAbbreviationList] = useState([]);
const [abbreviationList, setAbbreviationList] = useState([].sort());
const [deletedItems, setDeletedItems] = useState([[], [], []]);
const [selectedItems, setSelectedItems] = useState({ 0: [], 1: [], 2: [] });
const [searchQuery, setSearchQuery] = useState('');
const [deleteSearchQuery, setDeleteSearchQuery] = useState('');



const [abbreviationId, setAbbreviationId] = useState("");

const [open, setOpen] = useState(false);
const [status, setStatus] = useState('');

useEffect(() => {
    getAbbreviationsList();
  }, []);

  const getAbbreviationsList = async () => {
    try {
        let list = await getAllAbbreviations("0");
        const sortedList = list.sort((a, b) =>  a.abbreviation.localeCompare(b.abbreviation));
        setAllAbbreviationList(sortedList);
        let revistionRecord = await getNotReqAbbreviationIds(revisionData.docVersionReleaseId);
        let abbreviationIds = revistionRecord ? revistionRecord.split(",").map(Number) : ["0"];
        const mainlist = sortedList.filter((item) => !abbreviationIds.includes(item.abbreviationId));
        let deletedList = sortedList.filter((item) =>
          abbreviationIds.some((id) => String(id) === String(item.abbreviationId))
        );
        const columns = chunkArray(mainlist, 3);
        setAbbreviationList(deletedList);
        setDeletedItems(columns);
    } catch (error) {
        console.error('An error occurred');
    }
};


const chunkArray = (array, chunks) => {
    const result = [];
    for (let i = 0; i < chunks; i++) {
      result.push([]);
    }
    array.forEach((item, index) => {
      result[index % chunks].push(item);
    });
    return result;
  };


  
const handleFilterByLetter = (letter) => {
    setFilteredLetter(letter);
  };

  const handleResetFilter = () => {
    setFilteredLetter("");
  };

  const filteredList = abbreviationList.filter((abbr) => {
    const matchesLetter =
      !filteredLetter || abbr.meaning.startsWith(filteredLetter);
    const matchesSearch = !searchQuery || abbr.meaning.toLowerCase().includes(searchQuery.toLowerCase()) || abbr.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLetter && matchesSearch;
  });

  const handleSelectAll = (colIndex) => {
    const isAllSelected = selectedItems[colIndex].length === deletedItems[colIndex].length;
    const newSelectedItems = { ...selectedItems };
    newSelectedItems[colIndex] = isAllSelected ? [] : [...deletedItems[colIndex]];
    setSelectedItems(newSelectedItems);
  };

  const handleCheckboxChange = (colIndex, item) => {
    const newSelectedItems = { ...selectedItems };
    if (newSelectedItems[colIndex].includes(item)) {
      newSelectedItems[colIndex] = newSelectedItems[colIndex].filter((i) => i !== item);
    } else {
      newSelectedItems[colIndex].push(item);
    }
    setSelectedItems(newSelectedItems);
  };


  
  const goBack = () => {
    setStatus('userManualDocContent');
  };

  
  const handleDelete = async(abbreviationId) => {
    setAbbreviationId(abbreviationId);
           const confirm = await AlertConfirmation({
                title: 'Are you sure to delete?',
                message: '',
            });
            if (confirm) {
                
      let revistionRecord = await getNotReqAbbreviationIds(revisionData.docVersionReleaseId);
      let cleanAbbreviationIdNotReq = [];
      cleanAbbreviationIdNotReq = revistionRecord ? revistionRecord.split(",").map(Number) : [0];
      const combinedData = [...cleanAbbreviationIdNotReq, abbreviationId]
      .filter(id => id !== abbreviationId) 
      .sort((a, b) => a - b);
      let res = await updateNotReqAbbreviationIds(combinedData + '', revisionData.docVersionReleaseId + '');
      if (res && res > 0) {
        getAbbreviationsList();
        Swal.fire({
            icon: "success",
            title: 'Success',
            text: `Abbreviation Deleted Successfully`,
            showConfirmButton: false,
            timer: 2600
        });      

    } else {

        Swal.fire({
            icon: "error",
            title: 'Error',
            text: `Abbreviation Delete Unsuccessful!`,
            showConfirmButton: false,
            timer: 2600
        });      

    }
            }
  };

  const handleAddBack = async() => {
    const arr = [];
    for(var i in selectedItems){
      for(var j in selectedItems[i]){
       arr.push(selectedItems[i][j].abbreviationId)
     }
   }
   if (!arr.length) {
     Swal.fire({
        icon: "error",
        title: 'Error',
        text: `Please select at least one record.`,
        showConfirmButton: false,
        timer: 2600
    });      
    return;
  }

   const confirm = await AlertConfirmation({
    title: 'Are you sure to add?',
    message: '',
   });
    if (confirm) {

        let revistionRecord = await getNotReqAbbreviationIds(revisionData.docVersionReleaseId);
        const abbIdNotReq = revistionRecord ? revistionRecord.split(",").map(Number) : [0] ;
        const combinedIds = [...abbIdNotReq, ...arr];
        combinedIds.sort((a, b) => a - b);
        let res = await updateNotReqAbbreviationIds(combinedIds + '', revisionData.docVersionReleaseId + '');
        if (res && res > 0) {
          getAbbreviationsList();
          Swal.fire({
            icon: "success",
            title: 'Success',
            text: `Abbreviation Added to List Successfully`,
            showConfirmButton: false,
            timer: 2600
        });      

      } else {

        Swal.fire({
            icon: "error",
            title: 'Error',
            text: `Abbreviation Add Unsuccessful!`,
            showConfirmButton: false,
            timer: 2600
        });    

      }
   }

  }



  const validationSchema = Yup.object({
    abbreviations: Yup.array().of(
      Yup.object().shape({
        abbreviation: Yup.string().required("Abbreviation is required")
        .test("no-trailing-space", "Abbreviation cannot end with a space", (value) => !/\s$/.test(value))
        .test("no-leading-space", "Abbreviation cannot start with a space", (value) => !/^\s/.test(value)),
        meaning: Yup.string().required("Expansion is required")
        .test("no-trailing-space", "Expansion cannot end with a space", (value) => !/\s$/.test(value))
        .test("no-leading-space", "Expansion cannot start with a space", (value) => !/^\s/.test(value)),
      })
    ),
  });


  const handleSubmit = async(values) => {
    const confirm = await AlertConfirmation({
        title: 'Are you sure to add?',
        message: '',
       });
        if (confirm) {
            const abbreData = {
                abbreviationDetails:values.abbreviations,
                docVersionReleaseId:docRevId
              }
              let res = await addNewAbbreviationList(abbreData);
              if (res && res > 0) {
                getAbbreviationsList();
                setOpen(false);
                Swal.fire({
                    icon: "success",
                    title: 'Success',
                    text: `Abbreviation Added Successfully`,
                    showConfirmButton: false,
                    timer: 2600
                });      
        
            } else {
                Swal.fire({
                    icon: "error",
                    title: 'Error',
                    text: `Abbreviation Add Unsuccessful!`,
                    showConfirmButton: false,
                    timer: 2600
                });    

            }
        }

  };



  switch (status) {
    case 'userManualDocContent':
        return <UserManualAddDocContentEditorComponent versionElements={revisionData} ></UserManualAddDocContentEditorComponent>;
    default:
  return (
    <div>
        <Navbar></Navbar> 
        <Box className="container-fluid mt-4 p-4">
          <Grid container spacing={3}>
            {/* Alphabet Filter */}
            <Grid item xs={0.8}>
              <Card
                sx={{
                  height: "600px",
                  overflowY: "scroll",
                  backgroundColor: "#00c6ff",
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  scrollbarWidth: 'thin'
                }}
              >
                {alphabet.map((letter) => (
                  <Box
                    key={letter}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: filteredLetter === letter ? "green" : "white",
                      color: filteredLetter === letter ? "white" : "black",
                      textAlign: "center",
                      padding: "10px 20px",
                      marginBottom: "5px",
                      width: "100%",
                    }}
                    onClick={() =>
                      letter === "#" ? handleResetFilter() : handleFilterByLetter(letter)
                    }
                  >
                    {letter === "#" ? "ALL" : letter}
                  </Box>
                ))}
              </Card>
            </Grid>

            {/* Selected Abbreviation List */}
            <Grid item xs={4.2}>
              <Typography variant="h5" textAlign="center" className="mb-3">
                Selected Abbreviation List
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <TextField
                  variant="outlined"
                  placeholder="Search"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
              </Box>
              <Card
                sx={{
                  height: "500px",
                  overflowY: "auto",
                  padding: 2,
                  boxShadow: 2,
                  backgroundColor: "#F0F8FF",
                }}
              >
                {filteredList.map((abbr, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      borderBottom: "1px solid #8c8f92",
                      paddingY: 1,
                      "&:hover": {
                        backgroundColor: "rgb(169, 146, 59)",
                        color: "white",
                        padding: 1,
                      },
                    }}
                  >
                    <span>
                      <strong>{abbr.abbreviation}</strong> - {abbr.meaning}
                    </span>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(abbr.abbreviationId)}
                    >
                    <FaTrash/>
                    </button>
                  </Box>
                ))}
                {filteredList.length === 0 && (
                  <Typography variant="body2" textAlign="center" color="text.secondary">
                    No items found
                  </Typography>
                )}
              </Card>
              <Box mt={2} textAlign="center">
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                  ADD NEW
                </Button>
              </Box>
            </Grid>

            {/* All Abbreviation List */}
            <Grid item xs={7}>
              <Typography variant="h5" textAlign="center" className="mb-3">
                All Abbreviation List
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search"
                  value={deleteSearchQuery}
                  onChange={(e) => setDeleteSearchQuery(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
              </Box>
              <Grid container spacing={2}>
                {deletedItems.map((column, colIndex) => (
                  <Grid item xs={4} key={colIndex}>
                    <Card
                      sx={{
                        height: "500px",
                        overflowY: "auto",
                        padding: 2,
                        boxShadow: 2,
                        backgroundColor: "#F0F8FF",
                      }}
                    >
                      <Box textAlign="center">
                        <Checkbox
                          checked={
                            selectedItems[colIndex]?.length === column.length &&
                            column.length > 0
                          }
                          onChange={() => handleSelectAll(colIndex)}
                        />
                        <Typography>Select All</Typography>
                      </Box>
                      <hr />
                      {column
                        .filter(
                          (item) =>
                            item.meaning
                              .toLowerCase()
                              .includes(deleteSearchQuery.toLowerCase()) ||
                            item.abbreviation
                              .toLowerCase()
                              .includes(deleteSearchQuery.toLowerCase())
                        )
                        .map((item, rowIndex) => (
                          <Box
                            key={rowIndex}
                            display="flex"
                            alignItems="center"
                            sx={{
                              borderBottom: "1px solid #989a9c",
                              paddingY: 1,
                              "&:hover": {
                                backgroundColor: "rgb(224 189 58)",
                                color: "#ff0000"
                              },
                            }}
                          >
                            <Checkbox
                              checked={selectedItems[colIndex]?.includes(item)}
                              onChange={() => handleCheckboxChange(colIndex, item)}
                            />
                            <Typography>
                              <strong>{item.abbreviation}</strong> - {item.meaning}
                            </Typography>
                          </Box>
                        ))}
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box mt={2} textAlign="center">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddBack}
                >
                  ADD TO LIST
                </Button>
                <Button onClick={goBack} className="back ms-1">
                  BACK
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ backgroundColor: '#00c6ff', color: 'white' }}>Add New Abbreviation</DialogTitle>
        <Formik
          initialValues={{
            abbreviations: [{ abbreviation: "", meaning: "" }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors = {};
            values.abbreviations.forEach((item, index) => {
              if (
                allAbbreviationList.some(
                  (abbr) => abbr.abbreviation.toLowerCase() === item.abbreviation.toLowerCase()
                )
              ) {
                if (!errors.abbreviations) errors.abbreviations = [];
                errors.abbreviations[index] = {
                  abbreviation: "Abbreviation already exists!",
                };
              }
            });
            return errors;
          }}
        >
          {({ values, errors, touched, isValid }) => (
            <Form>
              <DialogContent>
                <FieldArray name="abbreviations">
                  {({ push, remove }) => (
                    <>
                      {values.abbreviations.map((_, index) => (
                        <Grid container spacing={2} alignItems="center" key={index} mb={2}>
                          <Grid item xs={4}>
                            <Field
                              name={`abbreviations[${index}].abbreviation`}
                              as={TextField}
                              label="Abbreviation"
                              fullWidth
                              size="small"
                              error={
                                touched.abbreviations?.[index]?.abbreviation &&
                                Boolean(errors.abbreviations?.[index]?.abbreviation)
                              }
                              helperText={
                                touched.abbreviations?.[index]?.abbreviation &&
                                errors.abbreviations?.[index]?.abbreviation
                              }
                            />
                          </Grid>
                          <Grid item xs={7}>
                            <Field
                              name={`abbreviations[${index}].meaning`}
                              as={TextField}
                              label="Expansion"
                              size="small"
                              fullWidth
                              error={
                                touched.abbreviations?.[index]?.meaning &&
                                Boolean(errors.abbreviations?.[index]?.meaning)
                              }
                              helperText={
                                touched.abbreviations?.[index]?.meaning &&
                                errors.abbreviations?.[index]?.meaning
                              }
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => push({ abbreviation: "", meaning: "" })}
                              color="primary"
                            >
                              <FaPlus />
                            </IconButton>
                            {values.abbreviations.length > 1 && (
                              <IconButton onClick={() => remove(index)} color="error">
                                <FaMinus />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      ))}
                    </>
                  )}
                </FieldArray>
              </DialogContent>
              <Box mt={2} mb={2} textAlign="center">
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  disabled={!isValid}
                >
                  Submit
                </Button>
                <Button onClick={() => setOpen(false)} className="back ms-1">
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};



};

export default withRouter(AbbreviationMaster);