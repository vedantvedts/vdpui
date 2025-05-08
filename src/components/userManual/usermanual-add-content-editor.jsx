import React, { useCallback, useEffect, useState,useMemo } from 'react';
import { Box, Breadcrumbs, Button, Grid, IconButton, Link, TextField, Tooltip, Typography, Container, Card, CardContent, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, List, ListItem, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import { Helmet } from 'react-helmet';
import withRouter from "../../common/with-router";
import { useNavigate } from 'react-router-dom';

import './user-manual-add-doc-content.css';

import $ from 'jquery';
import { addSubChapterNameByChapterId, deleteChapterByChapterId, getUserManualMainChapters, getUserManualSubChaptersById, updateChapterBySnNo, updateChapterContent, updateChapterNameById, updatechapterPagebreakAndLandscape } from 'services/usermanual.service';
import AlertConfirmation from "common/AlertConfirmation.component";
import { MdAccountTree } from "react-icons/md";
import UserManualDocsAddDocContentAddSectionDialog from './usermanual-add-content-section-dialog';
import UserManualDocRecordsComponent from './usermanual-doc-records';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import UserManualDocPrint from './usermanual-doc-print';
import AddAbbreviationComponent from 'components/userManual/add-abbreviation-content';

const UserManualAddDocContentEditorComponent = (props)=>{
    
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const [snSubmit,setSnSubmit] = useState(true);
    const [snLv1Submit,setSnLv1Submit] = useState(true);
    const [snLv2Submit,setSnLv2Submit] = useState(true);

    const [projectSelDto, setProjectSelDto] = useState(null);
    const versionElements  = props?.versionElements;


    const [AllChapters, setAllChapters] = useState([]);
    const [ChapterListFirstLvl, setChapterListFirstLvl] = useState([]);
    const [ChapterListSecondLvl, setChapterListSecondLvl] = useState([]);
    const [ChapterListThirdLvl, setChapterListThirdLvl] = useState([]);
    const [editChapterId, setEditChapterId] = useState(null);
    const [ChapterIdFirstLvl, setChapterIdFirstLvl] = useState(null);
    const [ChapterIdSecondLvl, setChapterIdSecondLvl] = useState(null);
    const [ChapterIdThirdLvl, setChapterIdThirdLvl] = useState(null);

    const [editChapterForm, setEditChapterForm] = useState({
        editChapterName: ''
    });
    const [AddNewChapterFormThirdLvl, setAddNewChapterFormThirdLvl] = useState({
        SubChapterName: ''
    });
    const [AddNewChapterFormSecondLvl, setAddNewChapterFormSecondLvl] = useState({
        SubChapterName: ''
    });

    const [refreshChapterId, setRefreshChapterId] = useState(0);


    const [EditorTitle, setEditorTitle] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [editorContentChapterId, setEditorContentChapterId] = useState('');

    const [isPagebreakAfter, setIsPagebreakAfter] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [status, setStatus] = useState('');
    const [chapterSnNos,setChapterSnNos] = useState(new Map());
    const [chapterLv1SnNos,setChapterLv1SnNos] = useState(new Map());
    const [chapterLv2SnNos,setChapterLv2SnNos] = useState(new Map());


    const [chapterSnId,setChapterSnId] = useState(0);

    const [noteOpen, setNoteOpen] = useState(false);
    const [levelForEditChapter, setLevelForEditChapter] = useState(0);
    const [levelForUpdateEditor, setLevelForUpdateEditor] = useState(0);



    const [openDialog, setOpenDialog] = useState(false);
    const [openDialog2, setOpenDialog2] = useState(false);
    const [openDialog3, setOpenDialog3] = useState(false);
    const [openDialog4, setOpenDialog4] = useState(false);

    const handleNoteOpen = () => setNoteOpen(true);
    const handleNoteClose = () => setNoteOpen(false);

    const getDocPDF = (versionElements) => {

        return <UserManualDocPrint action='' revisionElements={versionElements} buttonType={'Button'} />;
       }


    useEffect(() => {
        window.$('#summernote').summernote({
            airMode: false,
            tabDisable: true,
            popover: {
                table: [
                    ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                    ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
                ],
                image: [
                    ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                    ['remove', ['removeMedia']]
                ],
                link: [['link', ['linkDialogShow', 'unlink']]],
                air: [
                    [
                        'font',
                        [
                            'bold',
                            'italic',
                            'underline',
                            'strikethrough',
                            'superscript',
                            'subscript',
                            'clear'
                        ]
                    ]
                ]
            },
            height: '400px',
            placeholder: 'Enter text here...',
            toolbar: [
                ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
                [
                    'font',
                    [
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'superscript',
                        'subscript',
                        'clear'
                    ]
                ],
                ['fontsize', ['fontname', 'fontsize', 'color']],
                ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
                ['insert', ['table', 'picture', 'link', 'video', 'hr']],
                ['customButtons', ['testBtn']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '44', '56', '64', '76', '84', '96'],
            fontNames: ['Arial', 'Times New Roman', 'Inter', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times', 'MangCau', 'BayBuomHep', 'BaiSau', 'BaiHoc', 'CoDien', 'BucThu', 'KeChuyen', 'MayChu', 'ThoiDai', 'ThuPhap-Ivy', 'ThuPhap-ThienAn'],
            codeviewFilter: true,
            codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
            codeviewIframeFilter: true,
            callbacks: {
                // onBlur: (contents) => {
                //     setEditorContent(contents);
                // }
                // onChange: (contents) => {
                //     debouncedUpdate(contents);
                // }

                // onEnter: (contents) => {
                //     // getSummernoteValue();
                //     console.log('contents-----', contents)
                // }

                // onKeydown: function (e) {
                //     if (e.key === 'Enter') {
                //         e.preventDefault();
                //     }
                // }
            }
            
        });

    
        $('#summernote').summernote('code', editorContent);

        return () => {
            $('#summernote').summernote('destroy');
        };

    }, [editorContent, AllChapters]);



    const handlePagebreakChange = async (event) => {
        setIsPagebreakAfter(event.target.checked);
        let chapterPagebreakOrLandscape= new Array;
      chapterPagebreakOrLandscape.push(editorContentChapterId)
      chapterPagebreakOrLandscape.push(event.target.checked ? 'Y' : 'N')
      chapterPagebreakOrLandscape.push(isLandscape ? 'Y' : 'N')
        let response = await updatechapterPagebreakAndLandscape(chapterPagebreakOrLandscape);
      };
    
      const handleLandscapeChange = async (event) => {
        setIsLandscape(event.target.checked);
        let chapterPagebreakOrLandscape= new Array;
        chapterPagebreakOrLandscape.push(editorContentChapterId)
        chapterPagebreakOrLandscape.push(isPagebreakAfter ? 'Y' : 'N')
        chapterPagebreakOrLandscape.push(event.target.checked ? 'Y' : 'N')
        let response = await updatechapterPagebreakAndLandscape(chapterPagebreakOrLandscape);
    };


    useEffect(() => {
        const fetchData = async () => {

            try {
                const projectSelectedDto = {
                    projectId: versionElements.projectId
                  };
                  setProjectSelDto(projectSelectedDto);
                getAllChapters(projectSelectedDto,true);

            } catch (error) {
                setError('An error occurred');
                setIsLoading(false);
                console.error(error)
            }
        }


        fetchData();
    }, []);

    // Disable Bootstrap 5 tooltip functionality
    useEffect(() => {
        $.fn.tooltip = function () {
            return this;
        };
    }, []);


    const getAllChapters = async (projectSelectedDtoData,editorFlag) => {
        try {
            setChapterSnNos(new Map());
            const initialChapterSnNos = new Map();
            let AllChapters = await getUserManualMainChapters(projectSelectedDtoData);
            if (AllChapters && AllChapters.length > 0 && editorFlag) {
                setEditorTitle(AllChapters[0][3]);
                if(AllChapters[0][4] !== null){
                    setEditorContent(AllChapters[0][4]);
                    $('#summernote').summernote('code', AllChapters[0][4]);
                }
                setEditorContentChapterId(AllChapters[0][0])
                if (AllChapters[0][5] != null && AllChapters[0][5] + '' === 'Y') {
                    setIsPagebreakAfter(true);
                } else {
                    setIsPagebreakAfter(false);
                }
                if (AllChapters[0][6] != null && AllChapters[0][6] + '' === 'Y') {
                    setIsLandscape(true);
                } else {
                    setIsLandscape(false);
                }
            }
            (AllChapters || []).forEach(item =>{
                initialChapterSnNos.set(item[0],item[7])
            })
            
            setChapterSnNos(new Map(initialChapterSnNos));
            setAllChapters(AllChapters);

        } catch (error) {
            setError('An error occurred');
            setIsLoading(false);
            console.error(error)
        }
    };


    const getSubChapters = async (chapterId, level) => {
        setChapterSnId(chapterId)
        if (level === 1) {
            setChapterIdFirstLvl(prevId => prevId === chapterId ? null : chapterId);
        } else if (level === 2) {
            setChapterIdSecondLvl(prevId => prevId === chapterId ? null : chapterId);
        } else if (level === 3) {
            setChapterIdThirdLvl(prevId => prevId === chapterId ? null : chapterId);
        }
        try {
            setChapterLv1SnNos(new Map());
            setChapterLv2SnNos(new Map());
            const response = await getUserManualSubChaptersById(chapterId);
            if (level === 1) {
                const initialChapterSnNos = new Map();
                (response || []).forEach(item =>{
                    initialChapterSnNos.set(item[0],item[7])
                })
                setChapterLv1SnNos(new Map(initialChapterSnNos));
                setChapterListFirstLvl(response);
            } else if (level === 2) {
                const initialChapterSnNos = new Map();
                (response || []).forEach(item =>{
                    initialChapterSnNos.set(item[0],item[7])
                })
                setChapterLv2SnNos(new Map(initialChapterSnNos));
                setChapterListSecondLvl(response);
            } else if (level === 3) {
                setChapterListThirdLvl(response);
            }
        } catch (error) {
            console.error(error);
        }

    };

    const enableEditChapter = (chapterId, mode, value, refreshChapterId, level) => {
        setEditChapterForm({ editChapterName: value })
        setRefreshChapterId(refreshChapterId)
        setLevelForEditChapter(level);
        if (mode === 'edit') {
            setEditChapterId(chapterId);
        } else {
            setEditChapterId(null);
        }
    };

    const updateChapterName = async(chapterId) => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to update?',
            message: '',
        });
        if (confirm) {
                let chapterName = new Array;
                chapterName.push(editChapterId)
                chapterName.push(editChapterForm.editChapterName)
                let res = await updateChapterNameById(chapterName);
                if (res && res > 0) {
                    if (levelForEditChapter > 0) {
                        if (levelForEditChapter === 1) {
                            setChapterIdFirstLvl(null);
                        } else if (levelForEditChapter === 2) {
                            setChapterIdSecondLvl(null);
                        }
                        getSubChapters(refreshChapterId, levelForEditChapter);
                    } else {
                        getAllChapters(projectSelDto,true);
                    }

                    Swal.fire({
                        icon: "success",
                        title: 'Success',
                        text: `Updated Chapter Successfully`,
                        showConfirmButton: false,
                        timer: 2600
                    });      
                } else {
                    Swal.fire({
                        icon: "error",
                        title: 'Error',
                        text: `Update Chapter Unsuccessful!`,
                        showConfirmButton: false,
                        timer: 2600
                    });      
                }
            setEditChapterId(null);
        }
    };

    
    const afterSubmit = async(level0fSnNo) => {
        console.log('sn level in  afterSubmit'+level0fSnNo);
        if(level0fSnNo === 1){
            getAllChapters(projectSelDto,false)
        }else if(level0fSnNo === 2){
            setChapterLv1SnNos(new Map());
            const initialChapterSnNos = new Map();
            const response = await getUserManualSubChaptersById(chapterSnId);
            (response || []).forEach(item =>{
                initialChapterSnNos.set(item[0],item[7])
            })
            setChapterLv1SnNos(new Map(initialChapterSnNos));
            setChapterListFirstLvl(response);
        }else if(level0fSnNo === 3){
            setChapterLv2SnNos(new Map());
            const initialChapterSnNos = new Map();
            const response = await getUserManualSubChaptersById(chapterSnId);
            (response || []).forEach(item =>{
                initialChapterSnNos.set(item[0],item[7])
            })
            setChapterLv2SnNos(new Map(initialChapterSnNos));
            setChapterListSecondLvl(response);
        }
    }



    const getUserManualChaptersDto = (chapter,level) => {
        setLevelForUpdateEditor(level);
        setEditorTitle(chapter[3])
        if(chapter[4] != null) {
            setEditorContent(chapter[4])
            $('#summernote').summernote('code',chapter[4]);
        }else{
            setEditorContent('');
            $('#summernote').summernote('code','');
        }
        setEditorContentChapterId(chapter[0]);
        if (chapter[5] != null && chapter[5] + '' === 'Y') {
            setIsPagebreakAfter(true);
        } else {
            setIsPagebreakAfter(false);
        }
        if (chapter[6] != null && chapter[6] + '' === 'Y') {
            setIsLandscape(true);
        } else {
            setIsLandscape(false);
        }
    };


    const deleteChapterById = async(reloadChapterId, chapterId, level) => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to delete?',
            message: '',
        });
        if (confirm) {
            let res = await deleteChapterByChapterId(chapterId);
            if (res && res > 0) {
                if (level > 0) {
                    if (level === 1) {
                        setChapterIdFirstLvl(null);
                    } else if (level === 2) {
                        setChapterIdSecondLvl(null);
                    }
                    getSubChapters(reloadChapterId, level);
                } else {
                    getAllChapters(projectSelDto,true);
                }
                Swal.fire({
                    icon: "success",
                    title: 'Success',
                    text: `Deleted Chapter Successfully`,
                    showConfirmButton: false,
                    timer: 2600
                });      
            } else {
                Swal.fire({
                    icon: "error",
                    title: 'Error',
                    text: `Delete Chapter Unsuccessful!`,
                    showConfirmButton: false,
                    timer: 2600
                });      
            }
    
        }
    };

    const updateEditorContent = async() => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to update?',
            message: '',
        });
        if (confirm) {
            const content = $('#summernote').summernote('code');
            setEditorContent(content);
            let chaperContent= new Array;
            chaperContent.push(editorContentChapterId)
            chaperContent.push(content)
            let res = await updateChapterContent(chaperContent);
            console.log('result of updateEditorContent'+JSON.stringify(res))
            if (res) {
             
                afterSubmit(levelForUpdateEditor);
                Swal.fire({
                    icon: "success",
                    title: 'Success',
                    text: `Updated Content Successfully`,
                    showConfirmButton: false,
                    timer: 2600
                });      


            } else {

                Swal.fire({
                    icon: "error",
                    title: 'Error',
                    text: `Update Content Unsuccessful!`,
                    showConfirmButton: false,
                    timer: 2600
                });      

            }
        }
    };


    const submitAddSubChapterForm = async(chapterId, level, serialNoAdd) => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to add chapter ?',
            message: '',
        });
        if (confirm) {
        try {
            var ChapterNameAndId = new Array;
            ChapterNameAndId.push(chapterId);
            if (level === 1) {
                ChapterNameAndId.push(AddNewChapterFormSecondLvl.SubChapterName)
            } else if (level == 2) {
                ChapterNameAndId.push(AddNewChapterFormThirdLvl.SubChapterName)
            }
            ChapterNameAndId.push(serialNoAdd)
            let res = await addSubChapterNameByChapterId(ChapterNameAndId);

            if (res && res > 0) {
                if (level > 0) {
                    if (level === 1) {
                        setChapterIdFirstLvl(null);
                    } else if (level === 2) {
                        setChapterIdSecondLvl(null);
                    }
                    getSubChapters(chapterId, level);
                } else {
                    getAllChapters(projectSelDto,true);
                }
                Swal.fire({
                    icon: "success",
                    title: 'Success',
                    text: `Updated Chapter Successfully`,
                    showConfirmButton: false,
                    timer: 2600
                });      

            } else {
                Swal.fire({
                    icon: "error",
                    title: 'Error',
                    text: `Update Chapter Unsuccessful!`,
                    showConfirmButton: false,
                    timer: 2600
                });      
            }
            setAddNewChapterFormSecondLvl({ SubChapterName: '' });
            setAddNewChapterFormThirdLvl({ SubChapterName: '' });
        } catch {
            setError('An error occurred');
            setIsLoading(false);
            console.error(error)
        }
        }
    };

    const duplicateChapterSnNos = useMemo(() => {
        const valueCount = new Map();
        const duplicates = new Set();
    
        chapterSnNos.forEach((value, key) => {
            if (valueCount.has(value)) {
                duplicates.add(key);
                duplicates.add(valueCount.get(value));
            } else {
                valueCount.set(value, key);
            }
        });
    
        return duplicates;
    }, [chapterSnNos]);


    useEffect(() => {
        if (duplicateChapterSnNos.size > 0) {
            setSnSubmit(false);
        } else {
            setSnSubmit(true);
        }
    }, [duplicateChapterSnNos]);
    
    const duplicateChapterLv1SnNos = useMemo(() => {
        const valueCount = new Map();
        const duplicates = new Set();
    
        chapterLv1SnNos.forEach((value, key) => {
            if (valueCount.has(value)) {
                duplicates.add(key);
                duplicates.add(valueCount.get(value));
            } else {
                valueCount.set(value, key);
            }
        });
        return duplicates;
    }, [chapterLv1SnNos]);

    useEffect(() => {
        if (duplicateChapterLv1SnNos.size > 0) {
            setSnLv1Submit(false);
        } else {
            setSnLv1Submit(true);
        }
    }, [duplicateChapterLv1SnNos]);


    const duplicateChapterLv2SnNos = useMemo(() => {
        const valueCount = new Map();
        const duplicates = new Set();
        chapterLv2SnNos.forEach((value, key) => {
            if (valueCount.has(value)) {
                duplicates.add(key);
                duplicates.add(valueCount.get(value));
            } else {
                valueCount.set(value, key);
            }
        });
        return duplicates;
    }, [chapterLv2SnNos]);


    useEffect(() => {
        if (duplicateChapterLv2SnNos.size > 0) {
            setSnLv2Submit(false);
        } else {
            setSnLv2Submit(true);
        }
    }, [duplicateChapterLv2SnNos]);


    const handleOpenAbbreviation = useCallback(() => {
        setStatus('abbreviation');
    },[])

    const onChapterSnNoChange = (id,value,level) =>{
        if(level === 1){
            setChapterSnNos(prev => new Map(prev).set(id,Number(value)))
        }else if (level === 2){
            setChapterLv1SnNos(prev => new Map(prev).set(id,Number(value)))
        }else if (level === 3){
            setChapterLv2SnNos(prev => new Map(prev).set(id,Number(value)))
        }
    }


    const handleSnSubmit = async(level) => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to update serial no?',
            message: '',
        });
        if (confirm) {
                const response = await updateChapterBySnNo((level === 1?chapterSnNos:level === 2?chapterLv1SnNos:chapterLv2SnNos));
                if(response && response>0){
      
                // Trigger state refresh without full reload
                   afterSubmit(level);
                

                    Swal.fire({
                        icon: "success",
                        title: 'Success',
                        text: `Chapter SN No  Edited Successfully`,
                        showConfirmButton: false,
                        timer: 2600
                    });      
 
                       setEditChapterId(null);

            
              
                } 
    
    }
}
    

    const handleOpenUnaddedSections = () => {
        setOpenDialog(true)
    };


    const handleCloseSectionDialog = () => {
        setOpenDialog(false)
        getAllChapters(projectSelDto,true);
    };


    const goBack = () => {
        setStatus('list');
    };




    switch (status) {
        case 'abbreviation':
            return <AddAbbreviationComponent versionElements={versionElements}></AddAbbreviationComponent>;
            case 'list':
                return <UserManualDocRecordsComponent  projectId={versionElements.projectId} ></UserManualDocRecordsComponent>;
          case 'addContent':
        return null;
            // return <AddNewContentComponent versionElements={versionElements}></AddNewContentComponent>
        default:
        return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowX: 'hidden' }}>
            <Helmet>
                <title>VDP - User Manual Content</title>
            </Helmet>
            <Navbar/>
            <Box id="main-container" className='main-container'>
               <Box id="main-breadcrumb">
                    <Breadcrumbs separator=">" aria-label="breadcrumb" className="row headingLink">
                        <Link color="inherit" className="breadcrumb-item links bcLinks" 
                        href="/user-manual"
                        >
                            <MdAccountTree></MdAccountTree> User Manual Record
                        </Link>
                        <Typography color="textPrimary"> User Manual Doc Content </Typography>
                    </Breadcrumbs>
                </Box>

                <Box className="subHeadingLink d-flex flex-column flex-md-row justify-content-between">
                  <Box align='left' className="d-flex flex-column flex-md-row gap-1">
                  <Button className='topButtons' variant="contained" onClick={handleOpenAbbreviation}>Abbreviation<i className="material-icons" >text_fields</i></Button>
                  </Box> 
                  <Box className=" text-md-end mt-2 mt-md-0">
                  </Box>
                </Box>

                <Box id="main-wrapper">
                   <Box id="card-body" sx={{ marginBottom: '1px!important' }}>
                   <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                        <CardContent sx={{ height: '75vh', overflowY: 'auto', border: '0.3px solid #ABB2B9' }}>
                                        {AllChapters &&  AllChapters.length>0 && AllChapters.map((chapter, i) => {
                                                    const hasDuplicate = duplicateChapterSnNos.has(chapter[0]);
                                                    return (
                                                        <Grid key={i}>
                                                        <Grid className="custom-header">
                                                            <Grid container spacing={2} alignItems="center">
                                                                <Grid item xs={8} display="flex" alignItems="center">
                                                                    <Grid item xs={1.5}>
                                                                    <TextField label="SN No" size='small' value={chapterSnNos.get(chapter[0])} type="number" fullWidth 
                                                                        onChange={(e) => { const value = e.target.value;
                                                                            if(/^\d+$/.test(value) && value >= 1){
                                                                                onChapterSnNoChange(chapter[0],e.target.value,1);
                                                                            }else{
                                                                                onChapterSnNoChange(chapter[0],undefined,1);
                                                                            }
                                                                        }}
                                                                        sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                        "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: hasDuplicate ? 'red' : 'inherit',},
                                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: hasDuplicate ? 'red' : 'inherit',},
                                                                        },
                                                                        "& .MuiOutlinedInput-notchedOutline": {border: hasDuplicate ? '1px solid red' : '1px solid inherit' },
                                                                        "& .MuiInputLabel-root.Mui-focused": {color: hasDuplicate ? 'red' :'inherit',}}}/> 
                                                                    </Grid>
                                                                    <Grid item xs={0.5}></Grid>
                                                                    <Grid item xs={8}>
                                                                        {editChapterId === chapter[0] ? (
                                                                            <TextField
                                                                                size="small"
                                                                                fullWidth
                                                                                value={editChapterForm.editChapterName}
                                                                                onChange={(e) =>
                                                                                    setEditChapterForm({ editChapterName: e.target.value })
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <TextField
                                                                                size="small"
                                                                                fullWidth
                                                                                value={chapter[3]}
                                                                                InputProps={{ readOnly: true }}
                                                                            />
                                                                        )}
                                                                    </Grid>
                                                                    {editChapterId !== chapter[0] ? (
                                                                        <Grid item xs={2} m={1}>
                                                                            <Tooltip title="Edit">
                                                                                <span>
                                                                                    <IconButton onClick={(e) => enableEditChapter(chapter[0], 'edit', chapter[3], 0, 0)}>
                                                                                        <i className="material-icons" style={{ color: 'orange' }}>edit</i>
                                                                                    </IconButton>
                                                                                </span>
                                                                            </Tooltip>
                                                                        </Grid>
                                                                    ) : (
                                                                        <Grid item xs={3} m={1} display="flex">
                                                                            <Tooltip title="Update">
                                                                                <span>
                                                                                    <IconButton onClick={() => updateChapterName(chapter[0])} disabled={!editChapterForm.editChapterName}>
                                                                                        <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                                    </IconButton>
                                                                                </span>
                                                                            </Tooltip>
                                                                            <Tooltip title="Cancel Edit">
                                                                                <span>
                                                                                    <IconButton onClick={() => enableEditChapter(chapter[0], '')}>
                                                                                        <i className="material-icons" style={{ color: 'red' }}>close</i>
                                                                                    </IconButton>
                                                                                </span>
                                                                            </Tooltip>
                                                                        </Grid>
                                                                    )}
                                                                </Grid>
                                                                <Grid item xs={4} display="flex" justifyContent="flex-end">
                                                                    <Tooltip title={ChapterIdFirstLvl === chapter[0] ? 'Expand less' : 'Expand more'}>
                                                                        <span>
                                                                            <Button onClick={() => getSubChapters(chapter[0], 1)}>
                                                                                {ChapterIdFirstLvl === chapter[0] ? (
                                                                                    <i className="material-icons" style={{ color: '#FF0800' }}>expand_less</i>
                                                                                ) : (
                                                                                    <i className="material-icons" style={{ color: '#138808' }}>expand_more</i>
                                                                                )}
                                                                            </Button>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Open in editor">
                                                                        <span>
                                                                            <Button onClick={() => getUserManualChaptersDto(chapter,1)}>
                                                                                <i className="material-icons" style={{ color: 'orange' }}>edit_note</i>
                                                                            </Button>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Remove">
                                                                        <span>
                                                                            <Button onClick={() => deleteChapterById(0, chapter[0], 0)} className='delete-icon'>
                                                                                <i className="material-icons">remove</i>
                                                                            </Button>
                                                                        </span>
                                                                    </Tooltip>
                                                                </Grid>
                                                            </Grid>


                                                            {/* Second Level Start */}
                                                            {ChapterIdFirstLvl === chapter[0] && (
                                                                <Grid className=""  >
                                                                    {ChapterListFirstLvl.map((chapter1, j) => {
                                                                        const hasDuplicateLv1 = duplicateChapterLv1SnNos.has(chapter1[0]);
                                                                        return (
                                                                            <Grid key={chapter1[0]} className="custom-header">
                                                                            <Grid container spacing={2} alignItems="center">
                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={2} alignItems="center">
                                                                                        <Grid item xs={9} display="flex" alignItems="center">
                                                                                        <Grid item xs={0.8} className='fw-bolder'>{i + 1}.{j + 1}</Grid>
                                                                                            <Grid item xs={1.5}>
                                                                                                <TextField label="SN No" size='small' value={chapterLv1SnNos.get(chapter1[0])} type="number" fullWidth variant="outlined"
                                                                                                onChange={(e) => { const value = e.target.value;
                                                                                                    if(/^\d+$/.test(value) && value >= 1){
                                                                                                        onChapterSnNoChange(chapter1[0],e.target.value,2);
                                                                                                    }else{
                                                                                                        onChapterSnNoChange(chapter1[0],undefined,2);
                                                                                                    }
                                                                                                }}
                                                                                                sx={{
                                                                                                "& .MuiOutlinedInput-root": {
                                                                                                "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: hasDuplicateLv1 ? 'red' : 'inherit',},
                                                                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: hasDuplicateLv1 ? 'red' : 'inherit',},
                                                                                                },
                                                                                                "& .MuiOutlinedInput-notchedOutline": {border: hasDuplicateLv1 ? '1px solid red' : '1px solid inherit' },
                                                                                                "& .MuiInputLabel-root.Mui-focused": {color: hasDuplicateLv1 ? 'red' :'inherit',}}}InputLabelProps={{ shrink: true }}/> 
                                                                                            </Grid>
                                                                                            <Grid item xs={0.5}></Grid>
                                                                                            <Grid item xs={6.5}>
                                                                                                {editChapterId === chapter1[0] ? (
                                                                                                    <TextField size="small"
                                                                                                        fullWidth
                                                                                                        value={editChapterForm.editChapterName}
                                                                                                        onChange={(e) => setEditChapterForm({ editChapterName: e.target.value })}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <TextField size="small"
                                                                                                        fullWidth
                                                                                                        value={chapter1[3]}
                                                                                                        InputProps={{ readOnly: true }}
                                                                                                    />
                                                                                                )}
                                                                                            </Grid>
                                                                                            <Grid item xs={2.7} m={1} display={editChapterId === chapter1[0] ? 'none' : 'block'}>
                                                                                                <Tooltip title="Edit">
                                                                                                    <span>
                                                                                                        <IconButton onClick={() => enableEditChapter(chapter1[0], 'edit', chapter1[3], chapter[0], 1)}>
                                                                                                            <i className="material-icons" style={{ color: 'orange' }}>edit</i>
                                                                                                        </IconButton>
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            </Grid>
                                                                                            <Grid item xs={2.7} m={1} display={editChapterId === chapter1[0] ? 'flex' : 'none'}>
                                                                                                <Tooltip title="Update">
                                                                                                    <span>
                                                                                                        <IconButton onClick={() => updateChapterName(chapter1[0])} disabled={!editChapterForm.editChapterName}>
                                                                                                            <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                                                        </IconButton>
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                                <Tooltip title="Cancel Edit">
                                                                                                    <span>
                                                                                                        <IconButton onClick={() => enableEditChapter(chapter1[0], '')}>
                                                                                                            <i className="material-icons" style={{ color: 'red' }}>close</i>
                                                                                                        </IconButton>
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                        <Grid item xs={3} display="flex" justifyContent="flex-end">
                                                                                            <Tooltip title={ChapterIdSecondLvl === chapter1[0] ? 'Expand less' : 'Expand more'}>
                                                                                                <Button onClick={() => getSubChapters(chapter1[0], 2)}>
                                                                                                    {ChapterIdSecondLvl === chapter1[0] ? (
                                                                                                        <i className="material-icons" style={{ fontSize: '30px', color: '#FF0800' }}>expand_less</i>
                                                                                                    ) : (
                                                                                                        <i className="material-icons" style={{ fontSize: '30px', color: '#138808' }}>expand_more</i>
                                                                                                    )}
                                                                                                </Button>
                                                                                            </Tooltip>
                                                                                            <Tooltip title="Open in editor">
                                                                                                <span>
                                                                                                    <Button onClick={() => getUserManualChaptersDto(chapter1,2)}>
                                                                                                        <i className="material-icons" style={{ color: 'orange' }}>edit_note</i>
                                                                                                    </Button>
                                                                                                </span>
                                                                                            </Tooltip>
                                                                                            <Tooltip title="Remove">
                                                                                                <span>
                                                                                                    <Button onClick={() => deleteChapterById(chapter[0], chapter1[0], 1)} className='delete-icon'>
                                                                                                        <i className="material-icons">remove</i>
                                                                                                    </Button>
                                                                                                </span>
                                                                                            </Tooltip>
                                                                                        </Grid>
                                                                                    </Grid>

                                                                                    {/* Third Level (Nested) */}
                                                                                    {ChapterIdSecondLvl === chapter1[0] && (
                                                                                        <Grid>
                                                                                            {ChapterListSecondLvl.map((chapter2, k) => {
                                                                                            const hasDuplicateLv2 = duplicateChapterLv2SnNos.has(chapter2[0]);
                                                                                            return (<Grid spacing={2} key={chapter2[0]} className="custom-header" alignItems="center">
                                                                                                    <Grid item xs={12}>
                                                                                                        <Grid container spacing={2} alignItems="center">
                                                                                                            <Grid item xs={9} display="flex" alignItems="center">
                                                                                                                <Grid item xs={1} className='fw-bolder'>{i + 1}.{j + 1}.{k + 1}</Grid>
                                                                                                                <Grid item xs={1.5}>
                                                                                                                    <TextField label="SN No" size='small'  value={chapterLv2SnNos.get(chapter2[0])} type="number" fullWidth 
                                                                                                                    onChange={(e) =>{const value = e.target.value; 
                                                                                                                        if(/^\d+$/.test(value) && Number(value) >= 1 ){
                                                                                                                            onChapterSnNoChange(chapter2[0],e.target.value,3);
                                                                                                                        }else{
                                                                                                                            onChapterSnNoChange(chapter2[0],undefined,3);
                                                                                                                        }
                                                                                                                    }} 
                                                                                                                    sx={{
                                                                                                                    "& .MuiOutlinedInput-root": {
                                                                                                                    "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: hasDuplicateLv2 ? 'red' : 'inherit',},
                                                                                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: hasDuplicateLv2 ? 'red' : 'inherit',},
                                                                                                                    },
                                                                                                                    "& .MuiOutlinedInput-notchedOutline": {border: hasDuplicateLv2 ? '1px solid red' : '1px solid inherit' },
                                                                                                                    "& .MuiInputLabel-root.Mui-focused": {color: hasDuplicateLv2 ? 'red' :'inherit',}}}/> 

                                                                                                                </Grid>
                                                                                                                <Grid item xs={0.5}></Grid>
                                                                                                                <Grid item xs={7.5}>
                                                                                                                    {editChapterId === chapter2[0] ? (
                                                                                                                        <TextField size="small"
                                                                                                                            fullWidth
                                                                                                                            value={editChapterForm.editChapterName}
                                                                                                                            onChange={(e) => setEditChapterForm({ editChapterName: e.target.value })}
                                                                                                                        />
                                                                                                                    ) : (
                                                                                                                        <TextField size="small"
                                                                                                                            fullWidth
                                                                                                                            value={chapter2[3]}
                                                                                                                            InputProps={{ readOnly: true }}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                </Grid>
                                                                                                                <Grid item xs={2} m={1} display={editChapterId === chapter2[0] ? 'none' : 'block'}>
                                                                                                                    <Tooltip title="Edit">
                                                                                                                        <IconButton onClick={() => enableEditChapter(chapter2[0], 'edit', chapter2[3], chapter1[0], 2)}>
                                                                                                                            <i className="material-icons" style={{ color: 'orange' }}>edit</i>
                                                                                                                        </IconButton>
                                                                                                                    </Tooltip>
                                                                                                                </Grid>
                                                                                                                <Grid item xs={2} m={1} display={editChapterId === chapter2[0] ? 'flex' : 'none'}>
                                                                                                                    <Tooltip title="Update">
                                                                                                                        <IconButton onClick={() => updateChapterName(chapter2[0], 2, chapter1[0])} disabled={!editChapterForm.editChapterName}>
                                                                                                                            <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                                                                        </IconButton>
                                                                                                                    </Tooltip>
                                                                                                                    <Tooltip title="Cancel Edit">
                                                                                                                        <IconButton onClick={() => enableEditChapter(chapter2[0], '')}>
                                                                                                                            <i className="material-icons" style={{ color: 'red' }}>close</i>
                                                                                                                        </IconButton>
                                                                                                                    </Tooltip>
                                                                                                                </Grid>
                                                                                                            </Grid>

                                                                                                            {/* Third Level Buttons */}
                                                                                                            <Grid item xs={3} display="flex" justifyContent="flex-end">
                                                                                                                <Tooltip title="Open in editor">
                                                                                                                    <Button onClick={() => getUserManualChaptersDto(chapter2,3)}>
                                                                                                                        <i className="material-icons" style={{ color: 'orange' }}>edit_note</i>
                                                                                                                    </Button>
                                                                                                                </Tooltip>
                                                                                                                <Tooltip title="Remove">
                                                                                                                    <Button onClick={() => deleteChapterById(chapter1[0], chapter2[0], 2)} className='delete-icon'>
                                                                                                                        <i className="material-icons">remove</i>
                                                                                                                    </Button>
                                                                                                                </Tooltip>
                                                                                                            </Grid>
                                                                                                        </Grid>
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            )})}
                                                                                            {/* Add New Sub Chapter */}
                                                                                            <Grid className="custom-header" alignItems="center">
                                                                                                <Grid item xs={9}>
                                                                                                    <Grid container spacing={2} alignItems="center">
                                                                                                        <Grid item xs={1.5}>
                                                                                                            {i + 1}.{j + 1}.{ChapterListSecondLvl?.length > 0 ? ChapterListSecondLvl.length + 1 : 1}.
                                                                                                        </Grid>
                                                                                                        <Grid item xs={8}>
                                                                                                            <TextField size="small"
                                                                                                                fullWidth
                                                                                                                label="Add New Sub Chapter"
                                                                                                                value={AddNewChapterFormThirdLvl.SubChapterName}
                                                                                                                onChange={(e) => setAddNewChapterFormThirdLvl({ SubChapterName: e.target.value })}
                                                                                                            />
                                                                                                        </Grid>
                                                                                                        <Grid item xs={2.5}>
                                                                                                            <Button
                                                                                                                onClick={() => submitAddSubChapterForm(chapter1[0], 2,(ChapterListSecondLvl?.length > 0 ? ChapterListSecondLvl.length + 1 : 1))}
                                                                                                                disabled={!AddNewChapterFormThirdLvl.SubChapterName}
                                                                                                                variant="contained"
                                                                                                                color="primary"
                                                                                                            >
                                                                                                                Add
                                                                                                            </Button>
                                                                                                        </Grid>
                                                                                                    </Grid>

                                                                                                </Grid>
                                                                                            </Grid>
                                                                                            <Grid id="buttons-grid" item xs={12} mt={6} className="flex-center">
                                                                                                 <Button type="button" variant="contained" color="success" onClick={() =>handleSnSubmit(3)}  disabled = {!snLv2Submit}>Submit SN No</Button>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    )}

                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                        )})}

                                                                    <Grid className="custom-header" alignItems="center">
                                                                        <Grid item xs={9}>
                                                                            <Grid container spacing={2} alignItems="center">
                                                                                <Grid item xs={1.2}>
                                                                                    {i + 1}.{ChapterListFirstLvl?.length > 0 ? ChapterListFirstLvl.length + 1 : 1}.
                                                                                </Grid>
                                                                                <Grid item xs={7.7}>
                                                                                    <TextField
                                                                                        size="small"
                                                                                        fullWidth
                                                                                        label="Add New Sub Chapter"
                                                                                        value={AddNewChapterFormSecondLvl.SubChapterName}
                                                                                        onChange={(e) => setAddNewChapterFormSecondLvl({ SubChapterName: e.target.value })}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={2}>
                                                                                    <Button
                                                                                        onClick={() => submitAddSubChapterForm(chapter[0], 1,(ChapterListFirstLvl?.length > 0 ? ChapterListFirstLvl.length + 1 : 1))}
                                                                                        disabled={!AddNewChapterFormSecondLvl.SubChapterName}
                                                                                        variant="contained"
                                                                                        color="primary"
                                                                                    >
                                                                                        Add
                                                                                    </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid id="buttons-grid" item xs={12} mt={6} className="flex-center">
                                                                      <Button type="button" variant="contained" color="success" onClick={() =>handleSnSubmit(2)}  disabled = {!snLv1Submit}>Submit SN No</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            )}
                                                            {/* Second Level End */}

                                                        </Grid>

                                                    </Grid>
                                                    )})}
                                               
                                               {AllChapters && AllChapters.length>0 &&
                                                <Grid id="buttons-grid" item xs={12} mt={6} className="flex-center">
                                                    <Button type="button" variant="contained" color="success" onClick={() =>handleSnSubmit(1)}  disabled = {!snSubmit}>Submit SN No</Button>
                                                </Grid>
                                               }

                                                <Grid>
                                                <Tooltip title="Add Sections">
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        // title='Add Sections'
                                                        sx={{ mt: 3 }} // MUI spacing instead of Bootstrap's mt-3
                                                        onClick={handleOpenUnaddedSections}
                                                    >
                                                        <i className="material-icons">playlist_add</i>
                                                    </Button>
                                                </Tooltip>
                                                </Grid>
                                        </CardContent>
                                       </Card>
                                    </Grid>



                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            {AllChapters.length>0 && (
                                            <CardContent
                                                sx={{
                                                    height: '75vh',
                                                    overflowY: 'auto',
                                                    border: '0.3px solid #ABB2B9',
                                                }}
                                            >
                                                <Box className="m-2" display="flex" flexDirection="row">
                                                    <Box flexGrow={1}>
                                                        <Typography
                                                            // variant="h5"
                                                            component="div"
                                                            className="editor-title"
                                                            sx={{
                                                                backgroundColor: '#ffc107',
                                                                color: '#000',
                                                                paddingY: 1,
                                                                paddingX: 2,
                                                                borderRadius: '999px',
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            {EditorTitle}
                                                        </Typography>
                                                    </Box>
                                                  
                                                </Box> 

                                                <div>
                                                    <textarea id="summernote" ></textarea>
                                                </div>
                                                  

                                                <div className="row g-3 mt-2">
                                                      <div className="col-md-4">
                                                      <span className='me-3'>1. Is Pagebreak?</span>
                                                                  <FormControlLabel
                                                                      control={
                                                                          <Switch
                                                                              color="primary"
                                                                              checked={isPagebreakAfter}
                                                                              onChange={handlePagebreakChange}
                                                                          />
                                                                      }
                                                                  />
                                                      </div>
                                                      <div className="col-md-4">
                                                          <span className='me-3' >2. Is Landscape?</span>
                                                          <FormControlLabel
                                                              control={
                                                                  <Switch
                                                                      color="primary"
                                                                      checked={isLandscape}
                                                                      onChange={handleLandscapeChange}
                                                                  />
                                                              }
                                                          />
                                                      </div>
                                                      <div className="col-md-4 text-end">
                                                            <Button
                                                                variant="contained"
                                                                className='edit'
                                                                onClick={() => updateEditorContent()}
                                                            >
                                                                Update
                                                            </Button>
                                                      </div>
                                                  </div>
                                            </CardContent>
                                            )}
                                        </Card>
                                    </Grid>





                                </Grid>
                            </Grid>
                    </Grid>   

                    <div className="position-relative m-3">
                            {/* {docType.split('-')[0] === 'MQAP' ? (
                            <div className="position-absolute start-0">
                                   <FaInfoCircle className='animated-button' onClick={handleNoteOpen}/>
                            </div>
                            ) : '' }
                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="contained"
                                    sx={{background: 'palevioletred'}}
                                    className='me-1'
                                    onClick={() => addTableImageContent()}
                                >
                                  Table / Figure Content
                                </Button>*/}
                               <div className="d-flex justify-content-center">
                                {/* <Button onClick={handleRevokeSections} variant="contained" className="me-1">
                                   Revoke
                                </Button>*/}
                                {getDocPDF(versionElements)} 
                                {/* <Button onClick={goBack} className="back ms-1">
                                   Back
                                </Button> */}
                            </div> 
                        </div>
                   </Box>



                   <UserManualDocsAddDocContentAddSectionDialog 
                        open={openDialog}
                        onClose={handleCloseSectionDialog}
                        versionElements={versionElements} snNo = {AllChapters.length}
                    />


                </Box>
            </Box>


            <Dialog open={noteOpen} onClose={handleNoteClose}  maxWidth="md" fullWidth>
               <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                   Important Instructions
                </DialogTitle>
                <DialogContent>
                <Typography variant="body1" sx={{ fontSize: '0.825rem', mb: 2 }}>
                    Please ensure that all required details are correctly filled before proceeding, and  
                    the section names should be entered with the exact spelling; otherwise, you will not get data.
                </Typography>

                <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 2 }}>

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        Document Entry Guidelines:
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1 , textAlign: 'justify'}}>
                        - The following section names should be entered only at the **second level** (e.g., 1.1, 2.2, etc.).
                        <br /><br />- Reference Standards, Military Documents, International Documents are filled in the **Reference section**.
                        <br /><br />- System Specification, Project Documents, Realization Approach, Operational Conditions, Qualification Approach,
                                      MTBF, Qualification Tests Environmental and EMI-EMC are filled in the **Doc-Master section** before proceeding.
                        <br /><br />- Radar Product Tree is coming from PMS product tree ensure it filled in PMS.
                    </Typography>

                    <TableContainer className='table-note' component={Paper} sx={{ margin: "auto", mt: 3}}>
                        <Table>
                            <TableHead>
                            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                                <TableCell className='table-note' align="center" sx={{ width: '10%' }}><strong>Serial No</strong></TableCell>
                                <TableCell className='table-note' align="center" sx={{ width: '65%' }}><strong>Section Name</strong></TableCell>
                                <TableCell className='table-note' align="center" sx={{ width: '25%' }}><strong>Data From</strong></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"1"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Reference Standards"}</TableCell>
                                <TableCell rowSpan={3} className='table-note' align="center" sx={{ verticalAlign: "middle" }}>{"Reference"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"2"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Military Documents"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"3"}</TableCell>
                                <TableCell align="center" className='table-note'>{"International Documents"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"4"}</TableCell>
                                <TableCell align="center" className='table-note'>{"System Specification"}</TableCell>
                                <TableCell rowSpan={8} className='table-note' align="center" sx={{ verticalAlign: "middle" }}>{"Doc-Master"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"5"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Project Documents"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"6"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Realization Approach"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"7"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Operational Conditions"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"8"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Qualification Approach"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"9"}</TableCell>
                                <TableCell align="center" className='table-note'>{"MTBF values desired for each subsystems ( To be taken from Reliability allocation calculations)"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"10"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Qualification Tests(Environmental) Applicable Matrix"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"11"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Qualification Tests(EMI-EMC) Applicable Matrix"}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" className='table-note'>{"12"}</TableCell>
                                <TableCell align="center" className='table-note'>{"Radar Product Tree"}</TableCell>
                                <TableCell align="center" className='table-note'>{"PMS"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleNoteClose} variant="contained" color="primary">
                    Got It
                </Button>
                </DialogActions>
            </Dialog>


        </Box>
        






        
   
        );
    };
    };
    

export default withRouter(UserManualAddDocContentEditorComponent);