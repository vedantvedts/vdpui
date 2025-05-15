import axios from 'axios';
import config from '../environment/config';
import { authHeader } from './auth.header';

const API_URL = config.API_URL;


export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}authenticate`, {
      username: username.trim(), // Remove extra spaces
      password: password.trim()
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify({
        token: response.data.token,
        username: username
    }));
      //localStorage.setItem('refreshToken',response.data.refresh_token)
      const emp = await getEmpDetails(username);
      localStorage.setItem('roleId',emp.formRoleId)
      localStorage.setItem('roleName',emp.roleName)
      localStorage.setItem('empId',emp.empId)

      await customAuditStampingLogin(username);
 
      return response.data;

    }
  } catch (error) {
    console.error('Error occurred in login:', error);
    throw error;
  }
};

export const  getEmpDetails= async(username) => {
  if (!username) {
    throw new Error('No user found');
  } try {
    return (await axios.post(`${API_URL}get-emp-details`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
  } catch (error) {
    console.error('Error occurred in getEmpDetails():', error);
    throw error;
  }
};






// const GRANT_TYPE = config.GRANT_TYPE;
// const CLIENT_ID  = config.CLIENT_ID;
// const CLIENT_SECRET = config.CLIENT_SECRET;
// const TOKEN_URL = config.TOKEN_URL;


// export const login = async (username, password) => {
//     try {
  
//       const params = new URLSearchParams();
//       params.append('grant_type', GRANT_TYPE);
//       params.append('client_id', CLIENT_ID);
//       params.append('client_secret', CLIENT_SECRET); 
//       params.append('username', username);
//       params.append('password', password);

  
//       const headers = {'Content-Type': 'application/x-www-form-urlencoded',};
//       const response = await axios.post(TOKEN_URL, params, { headers });
  
//       if (response.data.access_token) {
//         localStorage.setItem('user', JSON.stringify({
//           token: response.data.access_token,
//           username: username
//       }));
//       console.log('response--------- ',response)
//         localStorage.setItem('refreshToken',response.data.refresh_token)
//         const emp = await getEmpDetails(username);
//         localStorage.setItem('roleId',emp.formRoleId)
//         localStorage.setItem('roleName',emp.roleName)
//         localStorage.setItem('empId',emp.empId)

  
//         await customAuditStampingLogin(username);
   
//         return response.data;
//       }
//     } catch (error) {
//       console.error('Error occurred in login:', error);
//       throw error;
//     }
//   };

// Function for custom audit stamping login
export const customAuditStampingLogin = async (username) => {
  if (!username) {
    throw new Error('No user found');
  }

  try {
    const response = await axios.post(
      `${API_URL}custom-audit-stamping-login`,
      username,  
      { headers: { 'Content-Type': 'application/json', ...authHeader() } }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in customAuditStampingLogin:', error);
    throw error;
  }
};



  export const logout = async (logoutType) => {
    const user = getCurrentUser();
    if (user && user.username) {
      try {
  
         customAuditStampingLogout(user.username, logoutType);
        localStorage.removeItem('user');
        localStorage.removeItem('roleId');
        localStorage.removeItem('password');
  
  
      } catch (error) {
        console.error('Error occurred in logout:', error);
        throw error; 
      }
    } else {
      // No user found in localStorage, just remove the item
      localStorage.removeItem('user');
      localStorage.removeItem('roleId');
      localStorage.removeItem('password');
    }
  };



// Function for custom audit stamping logout
export const customAuditStampingLogout = async (username, logoutType) => {
  if (!username) {
    throw new Error('No user found');
  }

  try {
    const response = await axios.post(
      `${API_URL}custom-audit-stamping-logout`,
      { username, logoutType },  
      { headers: { 'Content-Type': 'application/json', ...authHeader() } }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in customAuditStampingLogout:', error);
    throw error;
  }
};


  export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };




  // utils/loadingTab.js

  export const openLoadingTab = ({ 
    message = 'Please wait...', 
    spinnerColor = '#00c6ff', 
  }) => {
    const newTab = window.open('', '_blank');
    if (!newTab) {
      alert('Please allow pop-ups for this site.');
      return;
    }
  
    // Write loading animation to the new tab
    newTab.document.write(`
      <html>
        <head>
          <title>Loading...</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: rgb(248, 244, 244);
              font-family: Arial, sans-serif;
            }
            .spinner {
              border: 6px solid rgba(0, 0, 0, 0.1);
              border-top: 6px solid ${spinnerColor};
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            p {
              margin-top: 20px;
              font-size: 18px;
              color: black;
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <p><br>${message}</p>
        </body>
      </html>
    `);
  
    // Close document to ensure the page is rendered properly
    newTab.document.close();
  
    // Return an object with setPdfContent to allow setting the PDF content
    return {
      setPdfContent: (pdfBlob) => {
        // Once the PDF is ready, load it into the new tab
        const pdfUrl = URL.createObjectURL(pdfBlob);
        newTab.location.href = pdfUrl;
      }
    };

  };


  

export const openLoadingTabInSameTab = ({
  message = 'Please wait...', 
  spinnerColor = '#00c6ff', 
}) => {
  let spinnerPopup = null;

   // Block user interactions and scroll
   document.body.style.pointerEvents = 'none';  // Disable user interactions
   document.body.style.overflow = 'hidden';  // Prevent scrolling

   // Create a small popup with the spinner
   spinnerPopup = document.createElement('div');
   spinnerPopup.style.position = 'fixed';
   spinnerPopup.style.top = '50%';
   spinnerPopup.style.left = '50%';
   spinnerPopup.style.transform = 'translate(-50%, -50%)';
   spinnerPopup.style.width = '200px';
   spinnerPopup.style.height = '200px';
   spinnerPopup.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
   spinnerPopup.style.borderRadius = '10px';
   spinnerPopup.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
   spinnerPopup.style.zIndex = '9999'; // Ensure it overlays on top of content
   spinnerPopup.style.display = 'flex';
   spinnerPopup.style.flexDirection = 'column';
   spinnerPopup.style.justifyContent = 'center';
   spinnerPopup.style.alignItems = 'center';


   // Spinner styling
   const spinner = document.createElement('div');
   spinner.classList.add('spinner');
   spinner.style.border = `6px solid rgba(0, 0, 0, 0.1)`;
   spinner.style.borderTop = `6px solid ${spinnerColor}`;
   spinner.style.borderRadius = '50%';
   spinner.style.width = '50px';
   spinner.style.height = '50px';
   spinner.style.animation = 'spin 1s linear infinite';

   // Add spinner to the popup
   spinnerPopup.appendChild(spinner);

   // Loading message
   const loadingMessage = document.createElement('p');
   loadingMessage.style.marginTop = '20px';
   loadingMessage.style.fontSize = '16px';
   loadingMessage.style.color = 'black';
   loadingMessage.style.padding = '20px';
   loadingMessage.innerHTML = `<br>${message}`;
   spinnerPopup.appendChild(loadingMessage);

   // Append popup to body
   document.body.appendChild(spinnerPopup);

   // Add keyframes for spinning animation
   const style = document.createElement('style');
   style.innerHTML = `
     @keyframes spin {
       from { transform: rotate(0deg); }
       to { transform: rotate(360deg); }
     }
   `;
   document.head.appendChild(style);

   return {
    setContentInSameTab: () => {
      // Just close the loading popup
      document.body.removeChild(spinnerPopup);
      document.body.style.pointerEvents = 'auto'; // Enable user interactions
      document.body.style.overflow = 'auto'; // Allow scrolling
    },
  };
};







  
  

  