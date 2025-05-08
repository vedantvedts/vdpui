import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox, TextField, Box, Snackbar, Alert } from '@mui/material';
import AlertConfirmation from 'common/AlertConfirmation.component';
import { useEffect, useState } from 'react';
import UserManualDocSections, {addNewChapterSection, AddSectionIdsDto, getUnAddedChapters, unAddListToAddList } from 'services/usermanual.service';

const UserManualDocsAddDocContentAddSectionDialog = ({ open, onClose, versionElements,snNo }) => {

    const [error, setError] = useState(null);
    const [projectSelDto, setProjectSelDto] = useState(null);
    const [unAddedChapterList, setUnAddedChapterList] = useState([]);
    const [sectionIds, setSectionIds] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUnAddedChapterList([]);
                setSectionIds([]);
                setNewSectionName('');
              
                const projectSelDtoData = {
                  projectId: versionElements.projectId
                };
                setProjectSelDto(projectSelDtoData);
                getUnAddedChapterlist(projectSelDtoData);
            } catch (error) {
                setError('An error occurred');
            }
        }
        fetchData();
    }, [open]);



    const getUnAddedChapterlist = async (projectSelDtoArg) => {
        try {
            let unAddedChapterList = await getUnAddedChapters(projectSelDtoArg);
            setUnAddedChapterList(unAddedChapterList);
        } catch (error) {
            setError('An error occurred');
        }
    };

    const handleCheckboxChange = (id, event) => {
        if(event.target.checked){
          setSectionIds([...sectionIds, id]);
        } else {
          setSectionIds(sectionIds.filter((val)=> val !== id));
        }
      };

      const submitConfirmation = async() => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to submit?',
            message: '',
        });
        if (confirm) {
            
        let res = await unAddListToAddList(new AddSectionIdsDto(sectionIds,snNo));
         console.log('res reult :'+res);
        if (res) {
            getUnAddedChapterlist(projectSelDto);
            Swal.fire({
                icon: "success",
                title: 'Success',
                text: `Submitted Section Successfully`,
                showConfirmButton: false,
                timer: 2600
            });      

        } else {
            Swal.fire({
                icon: "error",
                title: 'Error',
                text: `Submit Section Unsuccessful!`,
                showConfirmButton: false,
                timer: 2600
            });     
        }

        onClose(false)
        setSectionIds([]);
        }
      }

      const addConfirmation = async() => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to add?',
            message: '',
        });
        if (confirm) {

            let docSections = new UserManualDocSections(0, newSectionName, projectSelDto.projectId,null,null,null,null, 1);

            let res = await addNewChapterSection(docSections);
    
            if (res && res.sectionId>0) {
                getUnAddedChapterlist(projectSelDto);
                Swal.fire({
                    icon: "success",
                    title: 'Success',
                    text: `Added Section Successfully`,
                    showConfirmButton: false,
                    timer: 2600
                });      

            } else {
                Swal.fire({
                    icon: "error",
                    title: 'Error',
                    text: `Add Section Unsuccessful!`,
                    showConfirmButton: false,
                    timer: 2600
                });      
            }
    
            setNewSectionName('');
        }
      }

      return (
        <Dialog
          open={open}
          onClose={() => onClose(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: '#00c6ff', color: 'white' }}>Choose Additional Chapter</DialogTitle>
          <DialogContent>
          <br />
          <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5', color: 'white',  }}>
            <TableRow>
              <TableCell align='center' style={{ fontWeight: 'bold', borderBottom: '2px solid #ddd', color: '#333' }}>Select</TableCell>
              <TableCell align='center' style={{ fontWeight: 'bold', borderBottom: '2px solid #ddd', color: '#333' }}>Section</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unAddedChapterList && unAddedChapterList.map((obj) => (
              <TableRow key={obj[0]}>
                <TableCell padding="none" align='center'>
                  <Checkbox
                    name="SectionIds"
                    value={obj[0]}
                    onChange={(event) => handleCheckboxChange(obj[0], event)}
                  />
                </TableCell>
                <TableCell padding="none">
                  <TextField size='small'
                    type="text"
                    value={obj[1]}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow >
                <TableCell padding="none" align='center'>
                <Button onClick={()=>addConfirmation()} className='add' variant="contained" disabled={!newSectionName}>
                  Add
              </Button>
                </TableCell>
                <TableCell padding="none">
                  <TextField size='small'
                    type="text" value={newSectionName}
                    fullWidth
                    placeholder='Enter new sectoin'
                    onChange={(e)=>setNewSectionName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br />
          <Box align='center'>
            <Button onClick={()=>submitConfirmation()} variant="contained" className='submit' disabled={sectionIds.length==0} >
              Submit
            </Button>
          </Box>
      <br />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose(false)} color="error">
              <i className="material-icons">close</i>
            </Button>
          </DialogActions>
   
        </Dialog>
      );
    };
export default UserManualDocsAddDocContentAddSectionDialog;