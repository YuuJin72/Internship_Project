import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, TextField, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg";
import { useNavigate } from 'react-router-dom';
import LatestPost from '../../common/study/LatestPost';
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

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 5000,
        cssEase: "linear"
    };

    const cards = [1, 2, 3, 4, 5, 6]

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
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="text.primary"
                  gutterBottom
                  mb={10}
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
            
            <Container sx={{ py: 8 }} maxWidth="md">
            <Typography
                  component="h3"
                  variant="h4"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  최신 스터디 목록
            </Typography>
              <LatestPost />
            <Typography
                  marginTop="8rem"
                  component="h3"
                  variant="h4"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  마감 임박 스터디
            </Typography>
            <Slider {...settings}>
                {cards.map((card) => (
                    <Card
                        key={card}
                        sx={{ height: '20rem', display: 'flex', flexDirection: 'column', p: '1rem'}}
                        >
                        <DefaultImage/>
                        <CardContent sx={{ flexGrow: 1}}>
                            <Typography gutterBottom variant="h5" component="h2">
                            {card}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">View</Button>
                            <Button size="small">Edit</Button>
                        </CardActions>
                    </Card>
                ))}
              </Slider>
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