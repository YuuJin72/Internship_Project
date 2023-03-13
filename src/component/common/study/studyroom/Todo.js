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
import TodoIndivMember from './TodoIndivMember';
import TodoAllMember from './TodoAllMember';

const Todo = () => {

    const getFormatDate = (date) => {
        let year = date.getFullYear();
        let month = (1 + date.getMonth())
        month = month >= 10 ? month : '0' + month
        let day = date.getDate()
        day = day >= 10 ? day : '0' + day
        return year + '-' + month + '-' + day
    }

    let today = getFormatDate(new Date())

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
      console.log(today)

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
                    <TodoAllMember />
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
                        Today : {today}
                    </Typography>
                    <p/>
                    <Typography>
                        <TodaysWork/>
                    </Typography>       
                </Grid>
                <Grid item xs={6}>
                    <TodoIndivMember />
                </Grid>
            </Grid>
            </Paper>
            </Container>
        </ThemeProvider>
    )
}

export default Todo