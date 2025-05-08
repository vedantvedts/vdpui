import React, { useEffect, useState } from 'react';

import { Button, IconButton } from '@mui/material';
import htmlToPdfmake from 'html-to-pdfmake';
import { openLoadingTab } from 'services/auth.service';
// import logoimage from '../../assets/images/logoimage.jpg';
import vedtslogo from '../../assets/images/vedtsLogo.png';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { getAllAbbreviations, getAllDocVersionDtoListByProject, getAllUserManualDocVersionDtoListByProject, getApprovedDocListByProject, getDocRevisionRecordById, getUserManualAllChapters } from 'services/usermanual.service';

pdfMake.vfs = pdfFonts.vfs;

const getBase64Image = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};



const UserManualDocPrint = ({action, revisionElements, buttonType }) => {

  const [logoBase64, setLogoBase64] = useState('');

    const [triggerEffect, setTriggerEffect] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [today, setToday] = useState(new Date());
    const [ApprovedVersionReleaseList, setApprovedVersionReleaseList] = useState([]);
    const [DocTemplateAttributes, setDocTemplateAttributes] = useState([]);
    const [AllChaptersList, setAllChaptersList] = useState([]);
    const [DocVersionListByProject, setDocVersionListByProject] = useState([]);
    const [tableContentList, setTableContentList] = useState([]);
    const [projectDocMainList,setProjectDocMainList] = useState([]);
    const [projectDocAllList,setProjectDocAllList] = useState([]); 
    const [docAbbreviationsResponse, setDocAbbreviationsResponse] = useState([]);
    

    var DocVersionRelease = [];

    useEffect(() => {
      // Convert the logo to base64 when component mounts
      const loadLogo = async () => {
        try {
          // Method 1: If using webpack/file-loader, the imported logo might already be a URL
          const base64 = await getBase64Image(vedtslogo);
          setLogoBase64(base64);
        } catch (error) {
          console.error("Failed to load logo:", error);
        }
      };
      loadLogo();
    }, []);
  

    const changeTriggerEffect = () => {
        setTriggerEffect(true);
        setIsReady(false);
      }

      useEffect(() => {
        const projectSelDto = {
          projectId: revisionElements.projectId,
            };
    
        Promise.all([
 
        getDocRevisionRecordById(revisionElements.docVersionReleaseId),
        getUserManualAllChapters(projectSelDto),
        getAllUserManualDocVersionDtoListByProject(projectSelDto),
        getApprovedDocListByProject(projectSelDto),
        getAllAbbreviations("0"),
        // getUserManualDocsProjectDocList(projectSelDto.projectId),

         //getAllAbbreviations("0"),
        //getDocSummarybyId(revisionElements.docVersionReleaseId),
        //getDocTemplateAttributes(),

      ]).then(([revisionData, AllChaptersList,  DocTemplateAttributes, ApprovedVersionReleaseList, docAbbreviationsResponse]) => {
          
         let abbreviationIds = revisionData.abbreviationIdNotReq ? revisionData.abbreviationIdNotReq.split(",").map(Number) : [0];
         let mainlist = docAbbreviationsResponse.filter((item) =>abbreviationIds.some((id) => id === item.abbreviationId))
                                                .sort((a, b) =>  a.abbreviation.localeCompare(b.abbreviation));
                                          

          setAllChaptersList(AllChaptersList);
          setDocTemplateAttributes(DocTemplateAttributes);
          setApprovedVersionReleaseList(ApprovedVersionReleaseList);
          setDocAbbreviationsResponse(mainlist);
 
          setIsReady(true);
          //setProjectDocAllList(projectDocList);
         // setProjectDocMainList(projectDocList.filter(obj => obj.levelId === 2));
          //setDocDistEmpList(docDist);
          setDocVersionListByProject(DocVersionListByProject);
        });
    
           if (isReady && triggerEffect) {
          setTriggerEffect(false);
          setIsReady(false);
          handlePdfGeneration();
        }
      }, [triggerEffect, isReady]);

          

    
      const setImagesWidth = (htmlString, width) => {
        const container = document.createElement('div');
        container.innerHTML = htmlString;
      
        const images = container.querySelectorAll('img');
        images.forEach(img => {
          img.style.width = `${width}px`;
          img.style.textAlign = 'center';
        });
        
        const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, td, th, table, v, figure, hr, ul, li');
        textElements.forEach(element => {
          if (element.style) {
            element.style.fontFamily = '';
            element.style.margin = '';
            element.style.marginTop = '';
            element.style.marginRight = '';
            element.style.marginBottom = '';
            element.style.marginLeft = '';
            element.style.lineHeight = '';
            element.style.height = '';
            element.style.width = '';
            element.style.padding = '';
            element.style.paddingTop = '';
            element.style.paddingRight = '';
            element.style.paddingBottom = '';
            element.style.paddingLeft = '';
            element.style.fontSize = '';
            element.id = '';
          }
        });
        
        return container.innerHTML; 
      };

// Generate rotated text image with line-wrapped text
function splitTextIntoLines(text, maxLength) {
  const lines = [];
    let currentLine = '';

  for (const word of text.split(' ')) {
      if ((currentLine + word).length > maxLength) {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
  }
    lines.push(currentLine.trim());
    return lines;
}


function generateRotatedTextImage(text) {
  const maxLength = 260;
  const lines = splitTextIntoLines(text, maxLength);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 200;
  canvas.height = 1560;
  ctx.font = '14px Roboto';
  ctx.fillStyle = 'rgba(128, 128, 128, 1)'; 
  ctx.translate(80, 1480); 
  ctx.rotate(-Math.PI / 2);
  const lineHeight = 20; 
  lines.forEach((line, index) => {
    ctx.fillText(line, 0, index * lineHeight);
  });
      return canvas.toDataURL();
}




    const handlePdfGeneration = () => {
        const todayMonth = today.toLocaleString('en-US', { month: 'short' }).substring(0, 3);
        var allValues = [];
        let mainList = Array.isArray(AllChaptersList) 
        ? AllChaptersList.filter(chapter => chapter[1] === 0) 
        : [];
        for (let i = 0; i < mainList.length; i++) {
             var copyArray = [...mainList[i]];
             copyArray.unshift((i + 1) + '.');
             allValues.push({ text: [copyArray[0], ' ', copyArray[4]], style: 'mainChaper', tocItem: true, pageBreak: 'before', pageOrientation: 'portrait' }, { stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'chaperContent' });
             let firstLvlList =  Array.isArray(AllChaptersList) 
             ? AllChaptersList.filter(chapter => chapter[1] === mainList[i][0]) 
             : [];



        // ---adding page break for main chapter
      
                             
        if(copyArray[6]+'' === 'Y'){
          if((i==0) || (i>0) && firstLvlList[i-1][6]+'' === 'N') {
            const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'mainChaper', tocItem: true, tocMargin: [15, 0, 0, 0], pageBreak: 'before' };
          }
          if((i+1<firstLvlList.length) && firstLvlList[i+1][5]+'' === 'N') {
            const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'chaperContent', pageBreak: 'after' };
          }
        }

      // ---adding landscape page for main chapter
      if(copyArray[7]+'' === 'Y' ){
        const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'mainChaper', tocItem: true, tocMargin: [15, 0, 0, 0], pageOrientation: 'landscape', pageBreak: 'before' };
        if((i+1<firstLvlList.length) && firstLvlList[i+1][6]+'' === 'N') {
          const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'chaperContent', pageOrientation: 'portrait', pageBreak: 'after' };
        } else {
          const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'applicableMatrixContent', pageOrientation: 'portrait',  };
        }
      } else if (allValues.length>3 && allValues[allValues.length-4].pageOrientation === 'landscape') {
        const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'mainChaper', tocItem: true, tocMargin: [15, 0, 0, 0], pageOrientation: 'portrait', pageBreak: 'before' };
      }




             for (let j = 0; j < firstLvlList.length; j++) {
                 var copyArray = [...firstLvlList[j]];
                 copyArray.unshift((i + 1) + '.' + (j + 1) + '.');
                 var chaptercontent = copyArray && copyArray.length > 0 && copyArray[5] != null ? copyArray[5] : '';

                     
        allValues.push({ text: [copyArray && copyArray.length > 0 && copyArray[0], ' ', copyArray[4]], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], }, { stack: [(copyArray && copyArray.length > 0 && copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'firstLvlContent' });
        // }
        // ---adding page break for first-level chapter
      
                             
        if(copyArray[6]+'' === 'Y'){
          if((j==0) || (j>0) && firstLvlList[j-1][6]+'' === 'N') {
            const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], pageBreak: 'before' };
          }
          if((j+1<firstLvlList.length) && firstLvlList[j+1][5]+'' === 'N') {
            const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'firstLvlContent', pageBreak: 'after' };
          }
        }

      // ---adding landscape page for  first-level chapter
      if(copyArray[7]+'' === 'Y' ){
        const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], pageOrientation: 'landscape', pageBreak: 'before' };
        if((j+1<firstLvlList.length) && firstLvlList[j+1][6]+'' === 'N') {
          const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'firstLvlContent', pageOrientation: 'portrait', pageBreak: 'after' };
        } else {
          const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'applicableMatrixContent', pageOrientation: 'portrait',  };
        }
      } else if (allValues.length>3 && allValues[allValues.length-4].pageOrientation === 'landscape') {
        const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], pageOrientation: 'portrait', pageBreak: 'before' };
      }



        let secondLvlList = Array.isArray(AllChaptersList)?AllChaptersList.filter(chapter => 
        chapter[1] === firstLvlList[j][0]
        ):[]


        for (let k = 0; k < secondLvlList.length; k++) {
          var copyArray = [...secondLvlList[k]];
          copyArray.unshift((i + 1) + '.' + (j + 1) + '.' + (k + 1) + '.');
          allValues.push({ text: [copyArray[0], ' ', copyArray[4]], style: 'secondLvlChapers', tocItem: true, tocMargin: [30, 0, 0, 0], }, { stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'secondLvlContent' });

          // ---adding page break  for  second-level chapter
          if(copyArray[6]+'' === 'Y'){
            if((k==0) || (k>0) && secondLvlList[k-1][6]+'' === 'N') {
              const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'secondLvlChapers', tocItem: true, tocMargin: [30, 0, 0, 0], pageBreak: 'before' };
            }
            if((k+1<secondLvlList.length) && secondLvlList[k+1][5]+'' === 'N') {
              const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'secondLvlContent', pageBreak: 'after' };
            }
          }
          // ---adding landscape page for second-level chapter
          if(copyArray[7]+'' === 'Y'){
            const val = allValues[allValues.length-2]={ text: [copyArray[0], ' ', copyArray[4]], style: 'secondLvlChapers', tocItem: true, tocMargin: [30, 0, 0, 0] , pageOrientation: 'landscape', pageBreak: 'before' };
            if((k+1<secondLvlList.length) && secondLvlList[k+1][6]+'' === 'N') {
              const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'secondLvlContent', pageOrientation: 'portrait', pageBreak: 'after' };
            } else {
              const val2 = allValues[allValues.length-1]={ stack: [(copyArray[5] !== null && copyArray[5] !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray[5], 600)) : ''], style: 'secondLvlContent', pageOrientation: 'portrait',  };
            }
          }

        }

    
          }
        }
    


        // ----------revision table start----------------
    var header1 = [
      { rowSpan: 2, text: 'Version', style: 'tableLabel' },
      { rowSpan: 2, text: 'Nature/Details of Revision', style: 'tableLabel' },
      { colSpan: 2, text: 'Version/Release Number', style: 'tableLabel' }, {},
      { rowSpan: 2, text: 'Issue date', style: 'tableLabel' },
      { rowSpan: 2, text: 'Reference No. Approval', style: 'tableLabel' }
    ];
    var header2 = [
      {},
      {},
      { text: 'From', style: 'tableLabel' },
      { text: 'To', style: 'tableLabel' },
      {},
      {}
    ];
    var DocVersionRelease = [];
    DocVersionRelease.push(header1);
    DocVersionRelease.push(header2);
    for (let i = 0; i < ApprovedVersionReleaseList.length; i++) {

      let datePart = '--'

      if (ApprovedVersionReleaseList[i][13] !== null && ApprovedVersionReleaseList[i][13] !== '' && ApprovedVersionReleaseList[i][13] !== undefined) {
        let dateTimeString = ApprovedVersionReleaseList[i][13].toString();
        let parts = dateTimeString.split(' ');

        datePart = parts[0] + ' ' + parts[1] + ' ' + parts[2];
      }
      var value = [

        { text: i, style: 'tdData', alignment: 'center' },
        { text: ApprovedVersionReleaseList[i][3], style: 'tdData' },
        { text: i > 0 ? 'V' + ApprovedVersionReleaseList[i - 1][5] + '-R' + ApprovedVersionReleaseList[i - 1][6] : '--', style: 'tdData', alignment: 'center', },
        { text: 'V' + ApprovedVersionReleaseList[i][5] + '-R' + ApprovedVersionReleaseList[i][6], style: 'tdData', alignment: 'center', },
        { text: datePart, alignment: 'center', style: 'tdData' },
        { text: 'V' + ApprovedVersionReleaseList[i][5] + '-R' + ApprovedVersionReleaseList[i][6], style: 'tdData', alignment: 'center', },
      ];

      DocVersionRelease.push(value);
    }

    // ----------revision table end----------------

        // ----------Document Abbreviation table start----------------
        let docAbbreviations = [];
        docAbbreviations.push([{ text: 'SN', style: 'tableLabel', alignment: 'center' }, { text: 'Abbreviation ', style: 'tableLabel', alignment: 'center' }, { text: 'Expansion', style: 'tableLabel', alignment: 'center' }])
        for (let i = 0; i < docAbbreviationsResponse.length; i++) {
          docAbbreviations.push([{ text: (i + 1), style: 'tdData', alignment: 'center' }, { text: docAbbreviationsResponse[i].abbreviation, style: 'tdData', alignment: 'left' }, { text: docAbbreviationsResponse[i].meaning, style: 'tdData' }])
        }
    
        // ----------Document Abbreviation table end----------------

    //////////////////////////////////////////////////User Manual Doc Definition Start/////////////////////////////////////////////////////////////////////////
         let docDefinition = {
          info: {
            title: "User Manual Print",
          },
          pageSize: 'A4',
          pageOrientation: 'portrait',
          pageMargins: [50, 50, 40, 40],
    
          header: function (currentPage) {
            return {
                stack: [
                                    {
                        columns: [
                            {
                                image: logoBase64,
                                width: 30,
                                height: 30,
                                alignment: 'left',
                                margin: [35, 10, 0, 10]
                            },
                            { text: 'RESTRICTED', style: 'headerrNote', margin: [0, 10, 0, 0] },
                            {
                                // Right: DRDO logo
                                image: logoBase64,
                                width: 30,
                                height: 30,
                                alignment: 'right',
                                margin: [0, 10, 20, 10]
                            }
                        ]
                    },
                    
                ]
            };
        },
          footer: function (currentPage, pageCount) {
            if (currentPage >= 2) {
              return {
                // style: [alignment:''],
                alignment: 'center',
                margin: [0, 15, 0, 10],
                stack: [{
                  columns: [
    
                    { text: today.getFullYear() + '/User Manual/' + revisionElements.projectMasterDto.projectShortName + '/' + (ApprovedVersionReleaseList.length), fontSize : 9,linkToDestination: 'TOC_PAGE'},
                    { text: 'RESTRICTED', style: 'footerNote',linkToDestination: 'TOC_PAGE' },
                    {
                      text: "Page " + currentPage.toString() + ' of ' + pageCount, margin: [45, 0, 0, 0], fontSize : 9,linkToDestination: 'TOC_PAGE' ,
                      color: 'blue',
                    },
                  ]
                },
                // { text: 'The information given in this document is not to be published or communicated, either directly or indirectly, to the press or to any personnel not authorized to receive it.', style: 'footertext' },
                ]
    
                
              }
            } else {
              return {
    
                alignment: 'center',
                margin: [0, 15, 0, 10],
                stack: [{
                  columns: [
                  
                    {},
                    { text: 'RESTRICTED', style: 'footerNote', },
                    {
                    },
                  ]
                },
                // { text: 'The information given in this document is not to be published or communicated, either directly or indirectly, to the press or to any personnel not authorized to receive it.', style: 'footertext' },
                ]
    
              };
            }
          },
          // defaultStyle,
    
          watermark: { text: 'VEDTS', opacity: 0.1, bold: true, italics: false, fontSize: 80,  },
          background: function (currentPage) {
            return [
              {
                image: generateRotatedTextImage((DocTemplateAttributes[6] != undefined && DocTemplateAttributes[6] != null ? DocTemplateAttributes[6] : '' )),
                width: 100, // Adjust as necessary for your content
                absolutePosition: { x: -10, y: 50 }, // Position as needed
              }
            ];
          },
    
          content: [
            {
              columns: [
                {
                  style: 'tableExample',
                  table: {
                    widths: [255],
                    body: [
                      [
                        {
                          stack: [
                            { text: 'RESTRICTED', style: 'superheader', },
                            { text: 'The information given in this document is not to be published or communicated, either directly or indirectly, to the press or to any personnel not authorized to receive it.', style: 'normal' },
                          ]
                        }
    
                      ],]
                  },
    
                },
                // {
                //   text: ':VEDTS: User Manual: \n ' + revisionElements.projectMasterDto.projectName + '', margin: [30, 0, 0, 0], bold: true,
                // },
              ]
            },
            {
              text: 'User Manual for \n' + revisionElements.projectMasterDto.projectName, style: 'DocumentName', alignment: 'center',
            },
             {
              image: logoBase64,
              width: 95, height: 75,
              alignment: 'center'
            },
            {
              text: 'Vedant Tech Solutions', style: 'LabAdress', margin: [0, 75, 0, 5], alignment: 'center', fontSize: 15
            },
    
            {
              text: '#42, 2nd Floor, Sakkamma Tower 2, Near \n' + 'Maheshwaramma Temple Road, B Chikkanna \n'+ 'Layout, Mahadevapura, Bengaluru - 560048.', style: 'LabAdressPin', alignment: 'center',
            },
            {
              text: todayMonth + '-' + today.getFullYear(), style: 'LabAdress', alignment: 'right', margin: [0, 200, 0, 0], pageBreak: 'after'
            },
            {
              text: 'RECORD OF AMENDMENTS', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
            },
            {
              table: {
                headerRows: 2,
                widths: ['auto', 'auto', 30, 30, 'auto', 'auto'],
                body: DocVersionRelease
              },
              pageBreak: 'after'
            },
            // {
            //   text: 'DISTRIBUTION LIST', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
            // },
            // {
            //   table: {
            //     widths: [20, 200, 120, 100],
            //     body: docDistributionList
            //   },
            //   pageBreak: 'after'
            // },
            // {
            //   text: 'DOCUMENT SUMMARY', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
            // },
            // {
            //   table: {
            //     widths: [105, 205, 155],
            //     heights: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
            //     body: docSummary
            //   },
            //   pageBreak: 'after'
            // },
            // {
            //   text: 'APPROVAL PAGE', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
            // },
            // {
            //   table: {
            //     widths: [100, 'auto', 120, 130],
            //     heights: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 30, 50, 50],
            //     body: approvalpage
            //   },
            //   pageBreak: 'after'
            // },
            {
              text: 'LIST OF ABBREVIATIONS', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
            },
            {
              table: {
                widths: [30, 120, 320],
                body: docAbbreviations
              },
              pageBreak: 'after'
            },
          {
          toc: {
            title: { text: 'TABLE OF CONTENTS', style: 'header', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10],id: 'TOC_PAGE' },
            numberStyle: { bold: true },
          },
          // pageBreak: 'after'

        },
            //  {
            //   text: 'TABLE OF TABLES',
            //   style: 'header',
            //   bold: true,
            //   alignment: 'center',
            //   fontSize: 14,
            //   margin: [0, 10, 0, 10],
            //   pageBreak: 'before' 
            // },
            // {
            //   table: {
            //     headerRows: 1,
            //     widths: ['10%', '35%', '40%', '15%'],
            //     body: [
            //       [{ text: 'S.No', bold: true }, { text: 'Table Name', bold: true }, { text: 'Table Description', bold: true }, { text: 'Page No.', bold: true }]
            //     ].concat(
            //        tableContentList.filter(data => data.contentType === 'T')
            //        .map((table, index) => [
            //         { text: index + 1 }, 
            //         { text: table.contentName, linkToPage: table.contentPageNo, color: 'blue' },
            //         { text: table.contentDescription, linkToPage: table.contentPageNo },
            //         { text: table.contentPageNo, linkToPage: table.contentPageNo }
            //       ])
            //     )
            //   },
            //   layout: 'lightHorizontalLines'
            // },
            // {
            //   text: 'TABLE OF FIGURES',
            //   style: 'header',
            //   bold: true,
            //   alignment: 'center',
            //   fontSize: 14,
            //   margin: [0, 10, 0, 10],
            //   pageBreak: 'before' 
            // },
            // {
            //   table: {
            //     headerRows: 1,
            //     widths: ['10%', '35%', '40%', '15%'],
            //     body: [
            //       [{ text: 'S.No', bold: true }, { text: 'Figure Name', bold: true }, { text: 'Figure Description', bold: true }, { text: 'Page No.', bold: true }]
            //     ].concat(
            //        tableContentList.filter(data => data.contentType === 'F')
            //        .map((table, index) => [
            //         { text: index + 1 }, 
            //         { text: table.contentName, linkToPage: table.contentPageNo, color: 'blue' },
            //         { text: table.contentDescription, linkToPage: table.contentPageNo },
            //         { text: table.contentPageNo, linkToPage: table.contentPageNo }
            //       ])
            //     )
            //   },
            //   layout: 'lightHorizontalLines'
            // },
            allValues,
            
           
   
  
              ],
    
          layouts: {
            noBorders: {
              defaultBorder: false
            }
          },
    
    
          styles: {
            tableExample: {
                margin: [35, 5, 0, 70],
                // alignment: 'center',
            },
            superheader: {
                fontSize: 11, bold: true,
                decoration: 'underline',
            },
    
            firstRestricted: {
                fontSize: 8,
                decoration: 'underline',
                margin: [0, 0, 0, 30]
    
            },
            DocumentName: {
                fontSize: 18,
                margin: [0, 30, 0, 35],
                bold: true,
                color: '#1660B2'
            },
            DocumentSubName: {
                fontSize: 17,
                margin: [0, 0, 0, 50],
                bold: true,
                color: '#CA6951'
            },
            DocumentName2Page: {
                fontSize: 25,
                margin: [0, 30, 0, 50],
                bold: true,
                color: '#1660B2'
            },
            LabAdress: {
                margin: [0, 30, 0, 0],
                width: [150],
                fontSize: 12,
                bold: true,
            },
            LabAdressPin: {
                width: [150],
                fontSize: 12,
                bold: true,
            },
            mainChaper: {
                fontSize: DocTemplateAttributes[1],
                bold: true,
            },
            chaperContent: {
                fontSize: DocTemplateAttributes[4],
                margin: [0, 10, 0, 10],
                alignment: 'justify',
            },
            firstLvlChapers: {
                fontSize: DocTemplateAttributes[2],
                bold: true,
                margin: [15, 10, 10, 0]
            },
            firstLvlContent: {
                fontSize: DocTemplateAttributes[4],
                margin: [15, 10, 0, 10],
                alignment: 'justify',
              
            },
            applicableMatrixContent: {
              fontSize: 11,
              margin: [15, 10, 0, 10],
              alignment: 'justify',
          },
            firstLvlMoreColumContent: {
                fontSize: 5.5,
                margin: [0, 0, 0, 0],
                alignment: 'justify',
            },
            firstLv2MoreColumContent: {
                fontSize: 10,
                margin: [0, 0, 0, 0],
                alignment: 'justify',
            },
    
            secondLvlChapers: {
                fontSize: DocTemplateAttributes[3],
                bold: true,
                margin: [30, 10, 10, 0]
            },
            secondLvlContent: {
                fontSize: DocTemplateAttributes[4],
                margin: [30, 10, 0, 10],
                alignment: 'justify',
            },
            tableLabel: {
                // color: '#0D509B',
                fontSize: 12,
                bold: true,
            },
            tdData: {
                fontSize: 12,
            },
            headerrNote: {
                fontSize: 7, bold: true,
                decoration: 'underline',
                alignment: 'center'
            },
            footerNote: {
                fontSize: 7, bold: true,
                decoration: 'underline',
                alignment: 'center'
            },
            footertext: {
                fontSize: 7,
            },
            appendixContent : {
              fontSize: DocTemplateAttributes[4],
            },
        },
    
    
        }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
       if (action === 'download') {
          pdfMake.createPdf(docDefinition).download('Print.pdf');
        } else if (action === 'print') {
          pdfMake.createPdf(docDefinition).print();
    
    
        } else {
    
    
    
                const loadingTab = openLoadingTab({
                    message: 'Generating your PDF, please wait...',
                    spinnerColor: '#6610f2', // Optional: Customize spinner color
                    });
                    
                    // Simulate PDF generation
                    setTimeout(() => {
                    pdfMake.createPdf(docDefinition).getBlob((blob) => {
                        // Set the generated PDF in the new tab
                        loadingTab.setPdfContent(blob);
                    });
                    }, 500);
    
    
        }
    
    }
    
    if (buttonType==='Button') {
        return <Button onClick={changeTriggerEffect} style={{ backgroundColor: '#6e78ff', color: 'white' }} >Print <i className="material-icons"  >print</i></Button> ;
      }
      if (buttonType==='download') {
        return <></>
      }
    
    
      return (
        <IconButton style={{ color: '#6e78ff' }} onClick={changeTriggerEffect} title="View"> <i className="material-icons"  >print</i></IconButton>
      );
    
      }
    export default UserManualDocPrint;