import PropTypes from 'prop-types';
import { Box, Typography, Container, Grid, TextField, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { searchState } from '../../../store/search'
import { Modal } from '../../modal/Modal';
import '../../../App.css'

const { Success, Warning, Failure } = Modal()

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
    const theme = useTheme();

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    </>
  );
}
  
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
 
export default function StudySearch() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([])
  const navigate = useNavigate()
  const searchReducer = useSelector((state) => state.search.value)
  const dispatch = useDispatch()
  

  useEffect(() => {
      const fetchPost = () => {
          axios.post("http://localhost:8080/study/search",{
              searchData: searchReducer
          })
          .then((res) => {
              if(res.data.message === "success") {
                  setRows(res.data.posts)
              }
              else if(res.data.message === "not_result") {
                  Warning('검색결과가 없습니다.')
                  setRows([])
              } else {
                  Failure('오류가 발생하였습니다.')
              }
          })
      }
      fetchPost();
  }, [searchReducer]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOnclick = (e) => {
      navigate(`/study/${e.target.id}`)
  }
  const [searchInput, SetSearchInput] = useState('')

  const handleChangeSearch = (e) => {
      SetSearchInput(e.target.value)
    }

  const handleSearch = () => {
      dispatch(searchState(searchInput))
  }

  return (
    <div className='bgcolor'>
      <Container maxWidth="md" sx={{bgcolor: 'white.main', pb: 4}}>
        <Typography
          variant="h3"
          align="center"
          sx={{pt: 10, pb: 10}}
        >
          검색 결과
        </Typography>
        <Grid container spacing={2} sx={{mb: 2}}>
          <Grid item xs={10} textAlign='center'>
            <TextField
              size="small"
              id="search"
              value={searchInput}
              onChange={handleChangeSearch}
              label="스터디 검색"
              name="search"
              fullWidth
              sx={{ml: 3}}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant='contained'
              color='darkblue'
              sx={{
                ml: '4rem'
              }}
              onClick={handleSearch}>검색</Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row) => (
                <TableRow key={row._num} hover={true} onClick={handleOnclick}>
                  <TableCell style={{ width: 20 }} component="th" scope="row">
                    {row._num}
                  </TableCell>
                  <TableCell style={{ width: 180 }} id={row._num}>
                    {row.title}
                  </TableCell>
                  <TableCell style={{ width: 180 }} id={row._num}>
                    {row.tag}
                  </TableCell>
                  <TableCell style={{ width: 60 }} id={row._num}>
                    {row.hostid}
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}