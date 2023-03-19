import React from 'react'
import { Grid, Typography, Container, Paper, Box } from '@mui/material'
import MyCalendar from '../../MyCalendar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'


const Home = () => {
    
    const [member, setMember] = useState([])
    const [ scheduleList, setScheduleList ] = useState('')
    const [mainSchedule, setMainSchedule] = useState({
        title: '',
        start: '',
        color: '#FFFF00'
    })
    const [isAwaiting, setIsAwaiting] = useState(false);
    const [D_day, setD_day] = useState('')
    const params = useParams()

    const fetchPost = () => {
        setIsAwaiting(false)
        axios.post(`http://localhost:8080/study/${params.id}/home`)
        .then((res) => {
            if(res.data.message === 'success'){
                const today = new Date()
                const dDay = new Date(res.data.homeresult[0].main_obj_date)
                const remainDay = Math.ceil((dDay - today) / (1000 * 60 * 60 * 24))
                setMainSchedule({
                    title: res.data.homeresult[0].main_obj,
                    start: res.data.homeresult[0].main_obj_date,
                    color: '#FF0000'
                })
                setMember(res.data.homeresult)
                setD_day(remainDay)
            }
        })
        .then(
        axios.post(`http://localhost:8080/study/${params.id}/todoall`)
        .then((res) => {
          if(res.data.message === 'success'){
            setScheduleList(res.data.result)
          } else {

          }

        })
        )
        setScheduleList(scheduleList => [...scheduleList, mainSchedule])
        setIsAwaiting(true)
    }


     

    useEffect(() => {
        fetchPost()
    }, [])

    const textSx = {
        p: 1.5,
        mt: 8, 
        ml: 13,
        mr: 13,
        textAlign: 'center',
        backgroundColor: 'blue.dark',
        borderRadius: 5,
        boxShadow: 5,
        color: 'white.main'
      }

      const textSx2 = {
        p: 1.5,
        mt: 8, 
        ml: 18,
        mr: 18,
        mb: 10,
        textAlign: 'center',
        backgroundColor: 'blue.dark',
        borderRadius: 5,
        boxShadow: 5,
        color: 'white.main'
      }

    return(
        <Container maxWidth='lg'  sx={{mt: 4, pb: 4}}>
            <Grid container rowSpacing={2} textAlign='center'>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Grid container rowSpacing={2} textAlign='center'>
                            <Grid item xs={5}>
                                <Typography variant='h3' sx={{pt: 4}}>
                                    {member[0]?.title}에 
                                </Typography>
                                <Typography variant='h3' sx={{pt: 0.5}}>
                                    어서오세요!
                                </Typography>
                                <Typography variant='h4' sx={textSx}>
                                    목표
                                </Typography>
                                <Typography variant='h4' sx={{mt: 3, mb: 6}}>
                                    {member[0]?.main_obj}
                                </Typography>
                                <Typography variant='h4' sx={textSx}>
                                    목표까지
                                </Typography>
                                <Typography  variant='h4' sx={{mt: 3}}>
                                    {D_day > 0 && `D - ${D_day}`}
                                    {D_day === 0 && `D - Day`}
                                    {D_day < 0 && `기간 초과`}
                                </Typography>
                                <Typography variant='h4' sx={textSx}>
                                    스터디 소개
                                </Typography>
                                <Typography variant='h5' sx={{mt: 3, mb: 6}}>
                                    {member[0]?.detail}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} >  
                                <Typography variant='h4' sx={textSx2}>
                                    멤버
                                </Typography>
                                <Box>
                                    <Grid container sx={{ mt: 4 }} textAlign='center' alignItems='center'>
                                        <Grid item xs={6}>
                                            <Typography variant='h4'>
                                                아이디
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='h4'>
                                                등급
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {member.map((el) => ( 
                                        <Grid 
                                        key={el.id}
                                        container sx={{ mt: 3 }} 
                                        textAlign='center' 
                                        borderRadius={3} 
                                        height='2rem' 
                                        alignItems='center'>
                                        <Grid item xs={6}>
                                            <Typography variant='h6'>
                                            {el.id}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            {el.id === el.hostid ? 
                                            <Typography variant='h6'>
                                                방장
                                            </Typography> : 
                                            <Typography variant='h6'>
                                                멤버
                                            </Typography>}
                                        </Grid>
                                    </Grid>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper
                        elevation={3}
                        sx={{
                        mt: 2,
                        mr: 2,
                        p: 5,
                        height: '100%',
                        width: '100%',
                        }}>
                        {isAwaiting && <MyCalendar prop={scheduleList}/>}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home