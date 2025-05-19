import React, { useEffect,useState } from "react";
import WordComponent from "static/converter.word.component";
import PdfComponent from  "static/converter.pdf.component";
import vedtslogo from '../../assets/images/vedtsLogo.png';
import { getAllAbbreviations, getAllDocVersionDtoListByProject, getAllUserManualDocVersionDtoListByProject, getApprovedDocListByProject, getDocRevisionRecordById, getDocTemplateAttributes, getUserManualAllChapters, getUserManualTableContentList } from 'services/usermanual.service';



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

const UserManualDocHtmlComponent = ({ id,printType, revisionElements}) => {

  //const pdfGenerator = PdfComponent();
  const wordGenerator = WordComponent();


      const [logoBase64, setLogoBase64] = useState('');

    const [triggerEffect, setTriggerEffect] = useState(false);

    const [today, setToday] = useState(new Date());
    const [ApprovedVersionReleaseList, setApprovedVersionReleaseList] = useState([]);
    const [DocTemplateAttributes, setDocTemplateAttributes] = useState([]);
    const [AllChaptersList, setAllChaptersList] = useState([]);
    const [DocVersionListByProject, setDocVersionListByProject] = useState([]);
    const [tableContentList, setTableContentList] = useState([]);
    const [docAbbreviationsResponse, setDocAbbreviationsResponse] = useState([]);
    
    const [isContentComplete, setIsContentComplete] = useState(false);  
        const [isReady, setIsReady] = useState(false);

  const expectedId = "user-manual-document-html"; // Permanent ID
  const [htmlDocumentContent, setHtmlDocumentContent] = useState("");

    useEffect(() => {
    if (id !== expectedId) {
      console.error(`Invalid ID: Expected ${expectedId}, but got ${id}`);
      return;
    }
  }, [id]);



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


     useEffect(() => {
          
        
       const fetchData = async () => {
          try {
       
  const projectSelDto = {
              projectId: revisionElements.projectId,
                };
        
            Promise.all([
     
            getDocRevisionRecordById(revisionElements.docVersionReleaseId),
            getUserManualAllChapters(projectSelDto),
            getApprovedDocListByProject(projectSelDto),
            getUserManualTableContentList(projectSelDto),
            getAllAbbreviations("0"),
            getDocTemplateAttributes(),

            //getAllUserManualDocVersionDtoListByProject(projectSelDto),
    
    
          ]).then(([revisionData, AllChaptersList, ApprovedVersionReleaseList,tableContentList, docAbbreviationsResponse,   docTemplateAttributes,]) => {
              
             let abbreviationIds = revisionData.abbreviationIdNotReq ? revisionData.abbreviationIdNotReq.split(",").map(Number) : [0];
             let mainlist = docAbbreviationsResponse.filter((item) =>abbreviationIds.some((id) => id === item.abbreviationId))
             .sort((a, b) =>  a.abbreviation.localeCompare(b.abbreviation));
                                              
    
              setAllChaptersList(AllChaptersList);
              setApprovedVersionReleaseList(ApprovedVersionReleaseList);
              setTableContentList(tableContentList);  
              setDocAbbreviationsResponse(mainlist);
              setDocTemplateAttributes(docTemplateAttributes);
              setIsReady(true);
              setDocVersionListByProject(DocVersionListByProject);
            });

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };


       fetchData();

        
          }, [revisionElements]);
  


   useEffect(() => {
  if (isReady) {
    handleUserManualHtmlGeneration();
  }
}, [isReady]);


/////////////////////////IMAGE START///////////////////
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
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (table.style) {
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
    }

    const cells = table.querySelectorAll('th, td');
    cells.forEach(cell => {
      if (cell.style) {
        cell.style.border = '1px solid black';

        if (cell.tagName.toLowerCase() === 'th') {
          cell.style.textAlign = 'center';
        }
      }
    });
  });
  return container.innerHTML.replace(/<v:[^>]*>[\s\S]*?<\/v:[^>]*>/gi, '');
};
/////////////////////////IMAGE END///////////////////
let htmlContent = '';

 const handleUserManualHtmlGeneration = () => {

  const superheaderContent = `
    <table style="width: 100%; border-collapse: collapse;padding: 0px;">
      <tr>
        <td style="width: 5%; border: none;"></td>
        <!-- RESTRICTED content with black border (50%) -->
        <td style="width: 45%; padding: 1px; border: 1px solid black; text-align: left;">
          <div>
            <span style="text-align: left;font-size: 11pt; font-weight: bold; text-decoration: underline;">
              RESTRICTED
            </span>
            <br>
            <span style="font-size: 12pt;text-align: left;">
              The information given in this document is not to be published or communicated, 
              either directly or indirectly, to the press or unauthorized personnel.
            </span>
          </div>
        </td>
          <td style="width: 5%; padding: 1px; border: none;"></td>
 
        <td style="width: 30%;border: none;text-align: right;">
         <div style="font-size: 13pt; font-weight: bold;padding: 1px; text-align: right; width: 200px; word-wrap: break-word;">
            
         </div>
        </td>
      </tr>
    </table>
    `;
  
  htmlContent += superheaderContent;

    const documentNameContent = `
  <div style="text-align: center;font-size: 20pt; color: #1660B2;font-weight: bold; margin-top: 100px; padding: 0; line-height: 1;">
      User Manual <br> for ${revisionElements.projectMasterDto.projectName}
  </div>
`;


htmlContent += documentNameContent;

const drdoLogoContent = `
<div style="text-align: center;">
    <img src="${logoBase64}" 
         alt="DRDO Logo" 
         width="135" 
         height="135" 
        />
</div>`;

htmlContent += drdoLogoContent;


const labDetailsContent = `
     <div style="text-align: center;margin-top: 15pt; margin-bottom: 0px;">
      <span style="text-align: center;color:#0072ff; padding-bottom: 10px;font-size: 18pt; font-weight: bold;">
      Vedant Tech Solutions<br>
    </span>
     </div>


    <div style="text-align: center;margin-top: 15pt; margin-bottom: 0px;">
     <span style="text-align: center; font-size: 12pt; font-weight: bold;margin-top:5pt;">
       #42, 2nd Floor, Sakkamma Tower 2 <br>
       Near Maheshwaramma Temple Road<br>
       B Chikkanna Layout, Mahadevapura<br>
       Bengaluru - 560048<br>
     </span>
   </div>
   
    <div style="text-align: center; margin-top: 10px;">
       <span style="font-weight: bold;">Website: </span>
        <a href="https://www.vedts.com/" style="color: #0072ff; text-decoration: underline;">www.vedts.com</a>
         &nbsp;&nbsp;&nbsp;
         <span style="font-weight: bold;">Phone: </span>
         <span style="color: #0072ff;">080-41620330</span>
     </div>
    <div id="page-break-after" style="page-break-after: always;"></div> <!-- Add page break after the table -->
`;

   htmlContent += labDetailsContent;


   

//Creating the HTML content for LIST OF ABBREVIATIONS   //docAbbreviations 
htmlContent += `
   <!--LIST OF ABBREVIATIONS Title -->
<div style="text-align: center; font-weight: bold; margin: 0; padding: 0; line-height: 1; height: auto;">
  <span style="font-size: 14pt; display: block; margin: 0; padding: 0;">LIST OF ABBREVIATIONS</span>
</div>
  <table id="listOfAbbreviationsTable" style="width: 100%; border-collapse: collapse; table-layout: fixed;" border="1">
     <thead>
    <tr>
      <!-- Header 1 -->
      <th  style="padding: 5px; text-align: center; font-size: 16px; font-weight: bold;">SN</th>
      <th style="padding: 5px; text-align: center; font-size: 16px; font-weight: bold;">Abbreviation</th>
      <th  style="padding: 5px; text-align: center; font-size: 16px; font-weight: bold;">Expansion</th>
    </tr>
   </thead>
    <tbody>
      <!-- Loop through MqapDistributionList for rows -->
      ${docAbbreviationsResponse.map((item, i) => {
        return `
          <tr>
            <td  style="text-align: center;padding: 5px;">${i + 1}</td>
            <td  style="padding: 5px;">${docAbbreviationsResponse[i].abbreviation}</td>
            <td   style="padding: 5px;">${docAbbreviationsResponse[i].meaning}</td>
          </tr>
        `;
      }).join('')}
      </tbody>
  </table>
<div id="page-break-after" style="page-break-after: always;"></div> <!-- Add page break after the table -->
`;



//////////////////////////////////////////////TOC Start////////////////////////
let tocHtml = '<div style="text-align: left;">';

// Main level TOC
let mainListForTOC = AllChaptersList.filter(chapter => chapter[1] === 0);

for (let i = 0; i < mainListForTOC.length; i++) {
  let copyArray = [...mainListForTOC[i]];
  copyArray.unshift(`${i + 1}.`);

  tocHtml += `
  <a href="#" style="color: black; display: block;">
    <span style="text-decoration: none; font-weight:normal;display: block; margin-left: 0; font-size: 13pt; ">
      ${copyArray[0]} ${copyArray[4]}
    </span>
  </a>
  <div style="text-align: left;margin-left: 20px;">`; // First level indentation

  // First Level
  let firstLvlListForTOC = AllChaptersList.filter(chapter => chapter[1] === mainListForTOC[i][0]);

  for (let j = 0; j < firstLvlListForTOC.length; j++) {
    let copyArray = [...firstLvlListForTOC[j]];
    copyArray.unshift(`${i + 1}.${j + 1}.`);

    tocHtml += `
    <a href="#" style="color: black; display: block;">
      <span style="text-decoration: none; font-weight:normal;display: block; margin-left: 0; font-size: 12pt;">
        ${copyArray[0]} ${copyArray[4]}
      </span>
    </a>
    <div style="text-align: left;margin-left: 30px;">`; 
    // Second Level
    let secondLvlListforTOC = AllChaptersList.filter(chapter => chapter[1] === firstLvlListForTOC[j][0]);

    for (let k = 0; k < secondLvlListforTOC.length; k++) {
      let copyArray = [...secondLvlListforTOC[k]];
      copyArray.unshift(`${i + 1}.${j + 1}.${k + 1}.`);

      tocHtml += `
      <a href="#" style="color: black; display: block;">
        <span style="text-decoration: none; font-weight:normal;display: block; margin-left: 0; font-size: 11pt;">
          ${copyArray[0]} ${copyArray[4]}
        </span>
      </a><br>`;
    }

    tocHtml += `</div>`; // Close second level
  }

  tocHtml += `</div>`; // Close first level
}

tocHtml += `</div>`; // Close main container

//////////////////////////////////////////////TOC End////////////////////////



// In case of dynamically generating the TOC (without reloading), it could look like this:

htmlContent += `
   <!--TABLE OF CONTENTS -->
<div style="text-align: center; font-weight: bold; margin: 0; padding: 0; line-height: 1;height: auto;">
  <span style="font-size: 14pt; display: block; margin: 0; padding: 0;">TABLE OF CONTENTS</span>
  <div id="append-table-of-contents">${tocHtml}</div>
</div>
<div id="page-break-after" style="page-break-after: always;"></div> <!-- Add page break after the table -->
`;

 // Filter the main chapters (level 1)
 let mainList = AllChaptersList.filter(chapter => {
  return chapter[1] === 0
});

   //////////main Chapter///////////////////////////////////////////////////////////// 
   for (let i = 0; i < mainList.length; i++) {
           var copyArray = [...mainList[i]];
           copyArray.unshift((i + 1) + '.');
           
     
     // Add main chapter content to HTML diva
     //id="main-chapter-${i}"
     htmlContent += `
        <div  class="mainChaper"  style="font-size: ${DocTemplateAttributes[1]}pt; font-weight: bold; margin: 0; padding: 0; line-height: 1;height: auto;">
             ${copyArray[0]} ${copyArray[4]}
         </div>
          <div  class="chaperContent" style="font-size: ${DocTemplateAttributes[4]}pt; margin: 0; text-align: justify; padding: 0; line-height: 1;height: auto;">
             ${copyArray[5] !== null && copyArray[5] !== 'null' ? setImagesWidth(copyArray[5], 600) : ''}
         </div>
        <div id="page-break-before" style="page-break-before: always;"></div> <!-- Add page break after the table --> <!-- Add page break for main chapter user on or dont on still it is manadatory -->
     `;
     
     // Filter and add first-level sub-chapters
     let firstLvlList = AllChaptersList.filter(chapter => {
      return chapter[1] === mainList[i][0]
    })


     for (let j = 0; j < firstLvlList.length; j++) {
         var copyArray = [...firstLvlList[j]];
         copyArray.unshift((i + 1) + '.' + (j + 1) + '.');


         // Add sub-chapter content
         var chaptercontent = copyArray[5] !== null ? copyArray[5] : '';
        
     
      //////////FirstLv///////////////////////////////////////////////////////////// 
           // Define the conditions for page breaks and landscape page
           const firstLvPageBreakCondition = copyArray[6] + '' === 'Y';
           const firstLvPageBreakBeforeChapterInPB = ((j==0) || (j>0) && firstLvlList[j-1][6]+'' === 'N');
           const firstLvPageBreakAfterContentInPB =  ((j+1<firstLvlList.length) && firstLvlList[j+1][5]+'' === 'N');
           const firstLvLandscapePageCondition = copyArray[7] + '' === 'Y';
           const firstLvPageBreakAfterContentInLS = ((j+1<firstLvlList.length) && firstLvlList[j+1][6]+'' === 'N');


           // --- @@@@@@@@@@@@@@@@@@@@// Check if page break before chapter is needed@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ---
            if ((firstLvPageBreakCondition && firstLvPageBreakBeforeChapterInPB) || firstLvLandscapePageCondition) {
                htmlContent += `<div id="page-break-before" style="page-break-before: always;"></div>`;
            }
          // ^^^^^^^^^^^^^ div landscape or portrait orientation start^^^^^^^^^^^^^^^^
          if (firstLvLandscapePageCondition) {
            htmlContent += `<div id="orientation-landscape" style="transform: rotate(90deg);">`;
          } else {
            htmlContent += `<div id="orientation-portrait">`;
          }
         // Adding the first-level chapter title  diva
         //id="first-chapter-${i}-${j}"
         htmlContent += `
            <div   class="firstLvlChapers" style="font-size: ${DocTemplateAttributes[2]}pt; font-weight: bold; margin-left: 15px; padding: 0; line-height: 1;height: auto;">
                 ${copyArray[0]} ${copyArray[4]}
             </div> 
             `;
        // Adding the first-level chapter content    
           htmlContent += `
             <div  class="firstLvlContent" style="font-size: ${DocTemplateAttributes[4]}pt;text-align: justify; margin-left: 15px;margin-bottom: 10px;  padding: 0; line-height: 1;height: auto;">
               ${chaptercontent !== null && chaptercontent !== 'null' ? setImagesWidth(chaptercontent, 600) : ''}
             </div>
          `;
           // ^^^^^^^^^^^^^^^^^^^^^^div landscape or portrait orientation end^^^^^^^^^^^^^^^^^^^^^^^^^^^  
           htmlContent += `</div>`;
            // --- @@@@@@@@@@@@@@@@@@@@// Check if page break after content is needed@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ---
            if ((firstLvPageBreakCondition && firstLvPageBreakAfterContentInPB) || (firstLvLandscapePageCondition && firstLvPageBreakAfterContentInLS)) {
              htmlContent += `<div id="page-break-after" style="page-break-after: always;"></div>`;
            }

            

    
        //////////secondLv///////////////////////////////////////////////////////////// 
        let secondLvlList = AllChaptersList.filter(chapter => {
            return chapter[1] === firstLvlList[j][0];
          });
        for (let k = 0; k < secondLvlList.length; k++) {
                  var copyArray = [...secondLvlList[k]];
                  copyArray.unshift((i + 1) + '.' + (j + 1) + '.' + (k + 1) + '.');


     
                  // Define the conditions for page breaks and landscape page
                  const secondLvPageBreakCondition = copyArray[6] + '' === 'Y';
                  const secondLvPageBreakBeforeChapterInPB = ((k == 0) || (k > 0) && secondLvlList[k - 1][6] + '' === 'N');
                  const secondLvPageBreakAfterContentInPB = ((k + 1 < secondLvlList.length) && secondLvlList[k + 1][5] + '' === 'N');
                  const secondLvLandscapePageCondition = copyArray[7] + '' === 'Y';
                  const secondLvPageBreakAfterContentInLS = ((k + 1 < secondLvlList.length) && secondLvlList[k + 1][6] + '' === 'N');
                  // --- @@@@@@@@@@@@@@@@@@@@// Check if page break before chapter is needed@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ---
                  if ((secondLvPageBreakCondition && secondLvPageBreakBeforeChapterInPB) || secondLvLandscapePageCondition) {
                      htmlContent += `<div id="page-break-before" style="page-break-before: always;"></div>`;
                  }
                  // ^^^^^^^^^^^^^ div landscape or portrait orientation start^^^^^^^^^^^^^^^^
                 if (secondLvLandscapePageCondition) {
                     htmlContent += `<div id="orientation-landscape" style="transform: rotate(90deg);">`;
                 } else {
                     htmlContent += `<div id="orientation-portrait">`;
                 }
                // Adding the second-level chapter title  diva
                // id="second-chapter-${i}-${j}-${k}"
                  htmlContent += `
                   <div class="secondLvlChapers"  style="font-size: ${DocTemplateAttributes[4]}pt; font-weight: bold; margin-left: 30px; margin-top: 10px;">
                       ${copyArray[0]} ${copyArray[4]}
                   </div>
                 `;
                 // Adding the second-level chapter content
                  htmlContent += `
                    <div class="secondLvlContent" style="font-size: ${DocTemplateAttributes[4]}pt; margin-left: 15px; margin-bottom: 10px; text-align: justify;">
                      ${(copyArray[5] !== null && copyArray[5] !== 'null') ? setImagesWidth(copyArray[5], 600) : ''}
                    </div>
                    `;
                  // ^^^^^^^^^^^^^^^^^^^^^^div landscape or portrait orientation end^^^^^^^^^^^^^^^^^^^^^^^^^^^  
                  htmlContent += `</div>`;
                  // --- @@@@@@@@@@@@@@@@@@@@// Check if page break after content is needed@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ---
                  if ((secondLvPageBreakCondition && secondLvPageBreakAfterContentInPB) || (secondLvLandscapePageCondition && secondLvPageBreakAfterContentInLS)) {
                    htmlContent += `<div id="page-break-after" style="page-break-after: always;"></div>`;
                  }
        }

         
     }
 }

     htmlContent += `<div id="page-break-before" style="page-break-before: always;"></div> <!-- Add page break after the table --> <!-- Add page break for main chapter user on or dont on still it is manadatory -->`;


htmlContent += `
  <div style="
    text-align: center;
    font-size: 46px;
    font-weight: bold;
    color: #0072ff;
    margin-top: 200px;
  ">
    Thank You
  </div>
  <div id="page-break-after" style="page-break-after:always;"></div> <!-- Mandatory page break after Thank You page -->
  `;


 
  htmlContent += `</div>`;




setHtmlDocumentContent(htmlContent);

setIsContentComplete(true); 
    };




          // Trigger onReady only when all content is loaded
        useEffect(() => {
          if (isContentComplete) {
         
  
              if (printType === "pdf") {
                  console.log("Generating PDF...");
                 // pdfGenerator.generatePDF(htmlDocumentContent,revisionElements.projectMasterDto.projectShortName,ApprovedVersionReleaseList.length,DocTemplateAttributes,AllChaptersList);
              } else if (printType === "word") {
                  console.log("Generating Word document...");
                  wordGenerator.generateWord(htmlDocumentContent,revisionElements.projectMasterDto.projectShortName,ApprovedVersionReleaseList.length,DocTemplateAttributes,AllChaptersList);
              }
  
          }
      }, [isContentComplete, htmlDocumentContent, printType, wordGenerator]);
  
      return null; // No rendering in the DOM since we are directly generating documents
  };


  


  

      // return (
      //   <div>
      //   <div id={id} className="qaqt-doc-html" dangerouslySetInnerHTML={{ __html: htmlDocumentContent }} />
      // </div>
      // );


export default UserManualDocHtmlComponent;

 