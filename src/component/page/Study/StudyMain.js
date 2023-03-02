import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg";
import { useNavigate } from 'react-router-dom';
import LatestPost from '../../common/study/LatestPost';

const theme = createTheme({
  palette: {
    green: {
      main: '#51cf66',
      contrastText: '#fff',
    },
    darkgreen: {
      main: '#2f9e44',
      contrastText: '#fff',
    },
  },
});

const StudyMain = () => {

    const navigate = useNavigate();

    const handleStudyCreate = () => {
        navigate('/study/create')
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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>
            <Box
              sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
              }}
            >
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  공 부 밭
                </Typography>
              </Container>
            </Box>
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
              color='darkgreen'
              sx={{
                ml: '1rem'
              }}
              onClick={handleStudyCreate}>전체 스터디 보기</Button>
              <Button
              variant='contained'
              color='darkgreen'
              sx={{
                ml: '1rem'
              }}
              onClick={handleStudyCreate}>새 스터디 생성</Button>
            </Typography>
            
            </Container>
           
          </main>
        </ThemeProvider>
      );
}

export default StudyMain;