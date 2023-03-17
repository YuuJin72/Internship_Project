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
                console.log(res.data.homeresult)
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
            console.log('err')
          }

        })
        )
        setScheduleList(scheduleList => [...scheduleList, mainSchedule])
        setIsAwaiting(true)
    }


     

    useEffect(() => {
        fetchPost()
    }, [])

    return(
        <Container
            maxWidth='lg' 
            sx={{
            mt: 5,
            mb: 5,
            }}
        >
            <Grid container rowSpacing={2} sx={{ m: 4 }} textAlign='center'>
                <Grid item xs={6}>
                    <Paper
                    elevation={3}
                    sx={{
                    mr: 2,
                    p: 2,
                    height: '100%',
                    width: '100%',
                        }}
                    >
                        {isAwaiting && <MyCalendar prop={scheduleList}/>}
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper
                        elevation={3}
                        sx={{
                        ml: 2,
                        p: 2,
                        height: '100%',
                        width: '100%',
                            }}
                        >
                        <Typography>
                            환영합니다!
                        </Typography>
                        <Typography>
                            목표 : {member[0]?.main_obj}
                        </Typography>
                        <Typography>
                            {D_day > 0 && `목표까지 D - ${D_day}`}
                            {D_day === 0 && `목표까지 D - Day`}
                            {D_day < 0 && `목표일정이 지났습니다.`}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper
                        elevation={3}
                        sx={{
                        mt: 2,
                        mr: 2,
                        p: 2,
                        height: '100%',
                        width: '100%',
                        }}>
                        <Typography>
                            {member[0]?.title} 소개
                        </Typography>
                        <p/>
                        <Box sx={{
                            height: 300,
                            width: '100%',
                        }}>
                            <Typography>
                                {member[0]?.detail}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper
                        elevation={3}
                        sx={{
                        mt: 2,
                        ml: 2,
                        p: 2,
                        height: '100%',
                        width: '100%',
                            }}
                        >
                        <Typography>
                            멤버
                        </Typography>
                        <Box>
                            <Grid container sx={{ mt: 4 }} textAlign='center' borderRadius={3} 
                                  height='2rem' 
                                  alignItems='center'>
                                <Grid item xs={6}>
                                    아이디
                                </Grid>
                                <Grid item xs={6}>
                                    등급
                                </Grid>
                            </Grid>
                            {member.map((el) => ( 
                                <Grid 
                                  key={el.id}
                                  container sx={{ mt: 1 }} 
                                  textAlign='center' 
                                  borderRadius={3} 
                                  height='2rem' 
                                  alignItems='center'>
                                <Grid item xs={6}>
                                    {el.id}
                                </Grid>
                                <Grid item xs={6}>
                                    {el.id === el.hostid ? '방장' : '멤버'}
                                </Grid>
                            </Grid>
                            ))}
                        </Box>
                        
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home