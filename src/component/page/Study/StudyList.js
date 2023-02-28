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
import './StudyList.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg";
import { useNavigate } from 'react-router-dom';

const StudyList = () => {

    const navigate = useNavigate();

    const onClickStudyCreate = () => {
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

    const cards = [1, 2, 3, 4, 5, 6];
    const theme = createTheme();

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
                  새 스터디 생성하기
                  <Button
                  variant='contained'
                  sx={{
                    ml: '1rem'
                  }}
                  onClick={onClickStudyCreate}>버튼</Button>
            </Typography>
            
            </Container>
           
          </main>
        </ThemeProvider>
      );
}

export default StudyList;