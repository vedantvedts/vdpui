import axios from 'axios';
import { authHeader } from './auth.header';
import config from "../environment/config";
const API_URL = config.API_URL;

export const getAllUserManualDocVersionDtoListByProject = async (projectSelDto) => {
    try {
        return (await axios.post(`${API_URL}user-manual-doc-version-list-by-project`, projectSelDto, 
            { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getAllUserManualDocVersionDtoListByProject', error);
        throw error;
    }
    
}


export const getUserManualDocTransactionList = async () => {
    try {
        return (await axios.get(`${API_URL}user-manual-doc-transaction-list` , 
            { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        throw error;
    }
}


export const addNewUserManualRelease = async (qaQTAddVerionDto) => {
    try {
        return (await axios.post(`${API_URL}add-new-user-manual-version`, qaQTAddVerionDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addNewUserManualRelease', error);
        throw error;
    }
}



export const updatechapterPagebreakAndLandscape = async (chapterPagebreakOrLandscape) => {
    try {
        return (await axios.post(`${API_URL}updatechapterPagebreakAndLandscape`, chapterPagebreakOrLandscape, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updatechapterPagebreakAndLandscape', error);
        throw error;
    }
}


export const getUserManualMainChapters = async (projectSelDto) => {
    try {
        return (await axios.post(`${API_URL}user-manual-main-chapter-list`, projectSelDto,
             { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUserManualMainChapters', error);
        throw error;
    }
}

export const getUserManualAllChapters = async (projectSelDto) => {
    try {
        return (await axios.post(`${API_URL}user-manual-all-chapter-list`, projectSelDto,
             { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUserManualAllChapters', error);
        throw error;
    }
}



export const getUserManualSubChaptersById = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}userManualSubChaptersById`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getSubChaptersById', error);
        throw error;
    }
}

export const updateChapterBySnNo = async (values) => {
    try {
       const arrayValues = Array.from(values,([id,value]) => ({id,value}))
        return (await axios.put(`${API_URL}update-chapter-by-sn-no`, arrayValues, 
            { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        throw error;
    }
}


export const updateChapterNameById = async (chapterName) => {
    try {
        return (await axios.post(`${API_URL}update-chapter-name-by-id`, chapterName,
             { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateChapterNameById', error);
        throw error;
    }
}

export const deleteChapterByChapterId = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}delete-chapter-by-id`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in deleteChapterById', error);
        throw error;
    }
}



export const updateChapterContent = async (chaperContent) => {
    try {
        return (await axios.post(`${API_URL}update-chapter-content-by-id`, chaperContent, 
            { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateChapterContent', error);
        throw error;
    }
}


export const addSubChapterNameByChapterId = async (chapterName) => {
    try {
        return (await axios.post(`${API_URL}add-new-sub-chapter-by-id`, chapterName, 
            { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addSubChapterNameByChapterId', error);
        throw error;
    }
}


export const getUnAddedChapters = async (projectSelDto) => {
    try {
        return (await axios.post(`${API_URL}user-manual-unadded-chapter-list`, projectSelDto,
             { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUnAddedChapters', error);
        throw error;
    }
}



class UserManualDocSections {
    constructor(
      sectionId = 0,
      sectionName = '',
      projectId,
      createdBy,
      createdDate,
      modifiedBy,
      modifiedDate ,
      isActive = 0
    ) {
      this.sectionId = sectionId;
      this.sectionName = sectionName;
      this.projectId = projectId;
      this.createdBy = createdBy;
      this.createdDate = createdDate;
      this.modifiedBy = modifiedBy;
      this.modifiedDate = modifiedDate;
      this.isActive = isActive;
    }
  }

  export default UserManualDocSections;


  export const addNewChapterSection = async (userManualDocSections) => {
    try {
        return (await axios.post(`${API_URL}user-manual-add-new-section`, userManualDocSections, 
            { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addNewChapter', error);
        throw error;
    }
}


export const unAddListToAddList = async (addSectionIdsDto) => {
    try {
        return (await axios.post(`${API_URL}user-manual-unadd-list-to-add-list`, addSectionIdsDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        throw error;
    }
}


export class AddSectionIdsDto{
    constructor(sectionIds,snNo){
        this.sectionIds = sectionIds;
        this.snNo       = snNo;
    }
}


export const getDocRevisionRecordById = async (docVersionReleaseId) => {
    try {
        return (await axios.post(`${API_URL}get-doc-revision-record`,
             docVersionReleaseId, 
             { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        throw error;
    }
}


export const getAllDocVersionDtoListByProject = async (projectSelDto) => {
    try {
        return (await axios.post(`${API_URL}getAllDocVersionDtoListByProject`, projectSelDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getAllDocVersionDtoListByProject', error);
        throw error;
    }
}


export const getApprovedDocListByProject = async (qaqtDocTypeAndProjectDto) => {
    try {
        return (await axios.post(`${API_URL}approved-user-manual-doc-list-by-project`, qaqtDocTypeAndProjectDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getApprovedDocListByProject', error);
        throw error;
    }
}


export const getAllAbbreviations = async () => {
    try {
        return (await axios.get(`${API_URL}get-abbreviation-list`,{ headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        throw error;
    }
}


export const getNotReqAbbreviationIds = async (DocVersionReleaseId) => {
    try {
        return (await axios.post(`${API_URL}get-not-req-abbreviation-ids`, DocVersionReleaseId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getNotReqAbbreviationIds', error);
        throw error;
    }
}


export const addNewAbbreviationList = async (qaqtDocAbbreviations) => {
    try {
        return (await axios.post(`${API_URL}add-new-abbreviation-list`, qaqtDocAbbreviations, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        throw error;
    }
}


export const updateNotReqAbbreviationIds = async (qaqtDocAbbreviations, DocVersionReleaseId) => {
    try {
        const AbbreviationIds=[qaqtDocAbbreviations, DocVersionReleaseId]
        return (await axios.post(`${API_URL}update-not-req-abbreviation-ids`, AbbreviationIds, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateNotReqAbbreviationIds', error);
        throw error;
    }
}


export const getUserManualTableContentList = async (qaqtDocTypeAndProjectDto) => {
    try {
        return (await axios.post(`${API_URL}get-table-content-list`, qaqtDocTypeAndProjectDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUserManualTableContentList', error);
    }
}

export const getUserManualTableContentById = async (contentId) => {
    try {
        return (await axios.post(`${API_URL}get-table-content-by-id`, contentId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUserManualTableContentById', error);
    }
}


export const updateUserManualTableContent = async (docContentDto) => {
    try {
        return (await axios.post(`${API_URL}update-user-manual-table-content`, docContentDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateUserManualTableContent', error);
    }
}


export const addUserManualTableContent = async (docContentDto) => {
    try {
        return (await axios.post(`${API_URL}add-user-manual-table-content`, docContentDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addUserManualTableContent', error);
    }
}



export const getDocTemplateAttributes = async () => {
    try {
        return (await axios.post(`${API_URL}get-doc-template-attributes`, null, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDocTemplateAttributes', error);
        throw error;
    }
}
