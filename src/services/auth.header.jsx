import { ListItem, styled } from "@mui/material";

export function authHeader() {
const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token,username:user.username };
  } else {

    return {};
  }
}

export const CustomMenuItem = styled(ListItem)(({ theme }) => ({
  borderBottom: '1px solid #e0e0e0',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&[aria-selected="true"]': {
    backgroundColor: '#019e30 !important',
    color: 'white',
  },
  '&.Mui-focused': {
    backgroundColor: 'rgb(71, 162, 242) !important',
    color: 'white',
  },
}));
