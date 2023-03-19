import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, TextField, Grid, Typography, Container } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import LatestPost from '../../common/study/LatestPost';
import DeadLine from '../../common/study/DeadLine';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { searchState } from '../../../store/search'



const StudyMain = () => {

    const navigate = useNavigate();
    const [searchInput, SetSearchInput] = useState('')

    const handleStudyCreate = () => {
        navigate('/study/create')
    }

    const handleStudyList = () => {
      navigate('/study/list')
  }

    const searchReducer = useSelector((state) => state.search.value)
    const dispatch = useDispatch()

    const handleChangeSearch = (e) => {
      SetSearchInput(e.target.value)
    }

    const handleSearch = () => {
      navigate('/study/search')
      dispatch(searchState(searchInput))
    }

    const textSx = {
      p: 2,
      mt: 15, 
      mb: 7,
      ml: 30,
      mr: 30,
      textAlign: 'center',
      backgroundColor: 'blue.dark',
      borderRadius: 5,
      boxShadow: 5,
      color: 'white.main'
    }

    return (
      <div className='bgcolor'>
        <Container maxWidth='lg'>
        <CssBaseline />
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm" >
              <Typography variant="h2" sx={{textAlign: 'center', mb: 5}}
              >
                공 부 밭
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    
                    size="small"
                    fullWidth
                    id="search"
                    value={searchInput}
                    onChange={handleChangeSearch}
                    label="스터디 검색"
                    name="search"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant='contained'
                    
                    sx={{
                      ml: '1rem'
                    }}
                    onClick={handleSearch}>검색</Button>
                </Grid>
              </Grid>
            </Container>
          <Container maxWidth="md">
            <Typography variant="h4" sx={textSx}>
              최신 스터디 목록
            </Typography>
              <LatestPost />
            <Typography variant="h4" sx={textSx}>
              마감 임박 스터디
            </Typography>
              <DeadLine />
            <Typography
                marginTop="8rem"
                component="h3"
                variant="h5"
                align="right"
                color="text.primary"
                gutterBottom
              >
              <Button
              variant='contained'
              
              sx={{
                ml: '1rem'
              }}
              onClick={handleStudyList}>전체 스터디 보기</Button>
              <Button
              variant='contained'
              
              sx={{
                ml: '1rem'
              }}
              onClick={handleStudyCreate}>새 스터디 생성</Button>
            </Typography>
          </Container>
          </Box>
        </Container>
      </div>
    );
}

export default StudyMain;