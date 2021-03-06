import React from "react";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import {styled} from '@mui/material/styles';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {HashLink} from "react-router-hash-link";
import {Link} from "@mui/material";

export function TabPanel(props) {
  const {children, value, index, ...other} = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 1}}>
          {children}
        </Box>
      )}
    </Box>
  );
}
// Free from https://www.svgrepo.com/svg/89875/network
export function GraphIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 55 55">
      <path d="M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17  s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4  c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562  C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829  c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91  v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4  s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665  C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z" />
    </SvgIcon>
  );
}
export function CHashLink(props) {
  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -55;
    window.scrollTo({top: yCoordinate + yOffset, behavior: 'smooth'});
  }
  return (
    <Link component={HashLink} to={props.to} smooth scroll={(el) => scrollWithOffset(el)}>{props.children}</Link>
  )
}
export const SecondaryTypo = styled(Typography)(({theme}) => {
  return {
    color: theme.palette.text.secondary
  };
});

export const HeaderTableCell = styled(TableCell)(({theme}) => ({
  borderColor: theme.palette.grey[300],
}));

export const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const Styled3n1TableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(3n+1)': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const Styled4n1TableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(4n+1)': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export const Styled6n1TableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(6n+1)': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export const Styled8n1TableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(8n+1)': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
