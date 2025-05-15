import React, { useEffect,useState } from "react";
import htmlDocx from "html-docx-js/dist/html-docx";
import { openLoadingTabInSameTab } from "services/auth.service";
import vedtslogo from '../assets/images/vedtsLogo.png';

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

const WordComponent = () => {

      const [isReady, setIsReady] = useState(false);
      const [today, setToday] = useState(new Date());
      
      const [logoBase64, setLogoBase64] = useState('');



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
  
  
  // Generate rotated text image with line-wrapped text
  function generateRotatedTextImage(text) {
    const maxLength = 260;
    const lines = splitTextIntoLines(text, maxLength);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set canvas dimensions based on anticipated text size and rotation
    canvas.width = 200;
    canvas.height = 1560;
    // Set text styling
    ctx.font = '14px Roboto';
    ctx.fillStyle = 'rgba(128, 128, 128, 1)'; // Gray color for watermark
    // Position and rotate canvas
    ctx.translate(80, 1480); // Adjust position as needed
    ctx.rotate(-Math.PI / 2); // Rotate 270 degrees
    // Draw each line with a fixed vertical gap
    const lineHeight = 20; // Adjust line height if needed
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight); // Position each line below the previous
    });
    return canvas.toDataURL();
  }
  

  const generateWord = (htmlContent,docType,projectSelected,length,templateAttributes,allChaptersList) => {
    if (!htmlContent) {
      console.error("No content found to generate Word!");
      return;
    }

 // Build the document content similar to the docDefinition
 const titleType = "User Manual";
 const projectShortName = projectSelected ? projectSelected : "";
 const lengthOfDocument = length ? length : "";
 const docTemplateAttributes = templateAttributes ? templateAttributes : "";


 const generateHeader = () => {
  return `
    <table style="width: 100%; table-layout: fixed;">
      <tr>
        <td style="width: 10%; text-align: left; padding: 10px;">
        
        </td>
        <td style="width: 80%; text-align: center; font-size: 7px; font-weight: bold; text-decoration: underline; padding: 5px 0;">
          RESTRICTED
        </td>
        <td style="width: 10%; text-align: right; padding: 10px;">
        
        </td>
      </tr>
    </table>
  `;
};

const generateFooter = () => {
  return `
    <table style="width: 100%; table-layout: fixed; margin-top: 20px; padding-top: 10px;">
      <tr>
        <td style="width: 33%; text-align: left; font-size: 9px;">
          
        </td>
        <td style="width: 34%; text-align: center; font-size: 9px; font-weight: bold; text-decoration: underline;">
          RESTRICTED
        </td>
        <td style="width: 33%; text-align: right; font-size: 9px;">
         
        </td>
      </tr>
    </table>
  `;
};


const headerContent = generateHeader();
const footerContent = generateFooter();

const wordContent = `
<html xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:w="urn:schemas-microsoft-com:office:word">
  <head>
   <meta charset="UTF-8">
    <style>
      /* Page definition */
@page {
    size: A4;
    margin: 1in;
    mso-header: h1;
    mso-footer: f1;
    mso-header-space: 35pt;
    mso-footer-space: 35pt;
}

div.header {
    mso-element: header;
    display: block;
}

div.footer {
    mso-element: footer;
    display: block;
}
      /* Body styling */
      body {
        font-family: Roboto, Arial, sans-serif;
        margin: 20px;
      }

   
      .logo {
        width: 50px;
        height: auto;
      }
      .main-content {
        margin: 40px 0;
        padding-top: 100px; /* Add space to prevent content overlap with header */
      }

    /* Prevent any list formatting */
    ul, li {
        list-style-type: none !important; /* No bullets */
        display: block !important; /* Ensure no default list rendering */
        mso-list: none !important; /* Disable Word list behavior */
        mso-style-type: none !important; /* Extra bullet prevention in Word */
        text-indent: 0 !important; /* Ensure no hidden list formatting */
    }
 
    </style>
  </head>
  <body>

 <!-- Page Header (Repeats on every page) -->
    <div class="header">
      ${headerContent}
    </div>
    
    <!-- Content with automatic page break handling -->
    <div class="page">
      <main class="main-content">${htmlContent}</main>
    </div>

    <!-- Page Footer (Repeats on every page) -->
    <div class="footer">
      ${footerContent}
    </div>


  </body>
</html>
`;


  // Encode content to handle special characters correctly
  let updatedHtmlContent = wordContent.replace(
    /<div id="page-break-(before|after)" style="page-break-(?:before|after): always;"><\/div>/g,
    '<br clear="all" style="mso-special-character: line-break; page-break-$1: always" />'
  );


  const loadingTab = openLoadingTabInSameTab({
    message: 'Generating your Word document, please wait...',
    spinnerColor: '#6610f2',
  });

  let downloadTriggered = false;

  setTimeout(() => {
    if (downloadTriggered) return;
    downloadTriggered = true;

    try {
      const converted = htmlDocx.asBlob(updatedHtmlContent);
      const Url = URL.createObjectURL(converted);

      // Create a Blob and directly trigger download
      const blob = new Blob([converted], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      // Directly trigger the download without using an <a> element
      const fileReader = new FileReader();
      fileReader.onload = function () {
        const link = document.createElement("a");
        const url = fileReader.result;
        const event = new MouseEvent('click');
        link.href = url;
        link.download = `${titleType || "document"}.docx`;
        link.dispatchEvent(event); // Trigger the click event programmatically

         // Close the loading tab after the download
         loadingTab.setContentInSameTab(blob); // Close the loading popup
      };

      fileReader.readAsDataURL(blob);

    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Something went wrong while generating the document.');
    }
  }, 500);
};

  
  return { generateWord };
};



export default WordComponent;
