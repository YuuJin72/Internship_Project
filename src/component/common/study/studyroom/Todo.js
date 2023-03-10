import React from 'react'
import { Grid, Typography, Container, Paper, Button } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import MyCalendar from '../../MyCalendar'
import TodaysWork from './TodaysWork';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'

const Todo = () => {

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

    return(
        <ThemeProvider theme={theme}>
        <Container
            maxWidth='lg' 
            sx={{
            mt: 5,
            mb: 5,
            }}
        >
            
            <Paper elevation={3} sx={{
                mr: 2,
                p: 2,
                height: '100%',
                width: '100%',
            }}>
            <Grid container rowSpacing={2} sx={{ m: 4 }} textAlign='center' display='flex'>
                <Grid item xs={6}>
                    <MyCalendar/>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        일정 (멤버 전체)
                    </Typography>
                    <Typography>
                        ㄹㄹ
                    </Typography>
                </Grid>
            </Grid>
            </Paper>
            <Paper
                elevation={3}
                sx={{
                mt: 2,
                mr: 2,
                p: 2,
                height: '100%',
                width: '100%',
            }}>
            <Grid container rowSpacing={2} sx={{ m: 4 }} textAlign='center' display='flex'>
                <Grid item xs={6}>
                    <Typography>
                        Today : 날짜
                    </Typography>
                    <p/>
                    <Typography>
                        <TodaysWork/>
                        <Button variant="contained">
                            저장
                        </Button>
                    </Typography>       
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        멤버 상태
                    </Typography>
                    <Typography>
                        새 테이블로 멤버 오늘 할일 종료 여부 불러오기
                    </Typography>
                </Grid>
            </Grid>
            </Paper>
            </Container>
        </ThemeProvider>
    )
}

export default Todo