import React from 'react'
import { Grid, Typography, Container, Paper } from '@mui/material'
import MyCalendar from '../../MyCalendar'
import TodaysWork from './TodaysWork';
import { useState } from 'react'
import TodoIndivMember from './TodoIndivMember';
import TodoAllMember from './TodoAllMember';
import axios from 'axios'
import { useParams } from 'react-router-dom';

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

    const params = useParams()
    const [ scheduleList, setScheduleList ] = useState('')
    const [ mainSchedule, setMainSchedule ] = useState('')

    const getScheduleList = (scheduleList) => {
        setScheduleList(scheduleList)
    }

    const fetchSchedule = () => {
        axios.get(`http://localhost:8080/study/${params.id}/schedule`)
        .then((res) => {
            setMainSchedule(res.data.result)
        })
    }

    console.log()

    return(
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
                        <TodoAllMember getScheduleList={getScheduleList} scheduleList={scheduleList}/>
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
    )
}

export default Todo