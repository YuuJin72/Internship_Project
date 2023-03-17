import { Container, Typography, TextField, Button, Grid, Box } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import 'react-day-picker/dist/style.css';
import NoAuth from './NoAuth'
import { Modal } from '../../../modal/Modal'

const Settings = () => {

    // 디자인
    const { Success, Failure } = Modal()
    const params = useParams()

    // 스터디룸 상태 관리
    const [post, setPost] = useState({
        title: '',
        tag: '',
        detail: '',
        main_obj: '',
    })
    const { title, tag, detail, main_obj, main_obj_date} = post
    const fetchPost = () => {
        axios.post(`http://localhost:8080/study/${params.id}/settingsr`)
        .then((res) => {
            if(res.data.message === 'success')
            setPost({
                title: res.data.result[0].title,
                tag: res.data.result[0].tag,
                detail: res.data.result[0].detail,
                main_obj: res.data.result[0].main_obj,
            })
            setObjDate(dayjs(res.data.result[0].main_obj_date))
        })
    }
    const handleOnchange = (e) => {
        const { name, value } = e.target
        setPost({
            ...post,
            [name]: value 
        })
    }
    useEffect(() => {
        fetchPost()
    },[])

    // 멤버 관리
    const [member, setMember] = useState([])
    const fetchMember = () => {
        axios.post(`http://localhost:8080/study/${params.id}/settingsm`)
        .then((res) => {
            if(res.data.message === 'success'){
                setMember(res.data.result)
            }
        })
    }
    const handleConfirm = (e) => {
        axios.post(`http://localhost:8080/study/${params.id}/memberconfirm`, {
            member: e.target.id
        })
        .then((res) => {
            if(res.data.message === 'success'){
                Success('처리가 완료되었습니다.')
                setMember(res.data.result)
            } else{
                Failure('에러가 발생했습니다.')
            }
        })
    }
    const handleNonConfirm = (e) => {
        axios.post(`http://localhost:8080/study/${params.id}/membernonconfirm`, {
            member: e.target.id
        })
        .then((res) => {
            if(res.data.message === 'success'){
                Success('처리가 완료되었습니다.')
                setMember(res.data.result)
            } else{
                Failure('에러가 발생했습니다.')
            }
        })
    }
    useEffect(() => {
        fetchMember()
    },[setMember])
    

    // 날짜 선택
    const [objDate, setObjDate] = useState(dayjs())

    // 저장
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        axios.post(`http://localhost:8080/study/${params.id}/settingsave`, {
            title: data.get('title'),
            tag: data.get('tag'),
            detail: data.get('detail'),
            main_obj: data.get('main_obj'),
            main_obj_date: objDate.format("YYYY-MM-DD")
        }).then((res) => {
            if(res.data.message === 'success'){
                Success('저장되었습니다.')
            } else{
                Failure('에러가 발생했습니다.')
            } fetchPost()
        })
    }

    return(
            <Container
                component='form'
                onSubmit={handleSubmit}
                maxWidth='md' 
                sx={{
                mt: 5,
                mb: 5,
                }}
            >
                <Grid container sx={{p: 2, m: 1}}>
                    <Grid item xs={12} >
                        {/* <NoAuth/> */}
                        <Typography>
                            방 제목 변경
                        </Typography>
                        <TextField name='title' value={post?.title || ''} placeholder='방 제목 변경' onChange={handleOnchange} sx={{mt: 2, width: '50%'}}/>
                        <Typography sx={{mt: 6}}>
                            태그 변경
                        </Typography>
                        <TextField name='tag' value={post?.tag || ''} placeholder='태그 변경' onChange={handleOnchange} sx={{mt: 2, width: '50%'}}/>
                        <Typography sx={{mt: 6}}>
                            방 설명 변경
                        </Typography>
                        <TextField name='detail' value={post?.detail || ''} placeholder='방 설명 변경' onChange={handleOnchange} multiline rows={8} sx={{mt: 2, width: '50%'}}/>
                        <Typography sx={{mt: 6}}>
                            주 목표 변경
                        </Typography>
                        <TextField name='main_obj' value={post?.main_obj || ''} placeholder='주 목표 변경' onChange={handleOnchange}  sx={{mt: 2, width: '50%'}}/>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{mt: 2, ml: 2}}
                            value={objDate}
                            onChange={(newDate) => setObjDate(newDate)}
                            />
                        </LocalizationProvider>
                        <Typography sx={{mt: 6}}>
                            멤버 관리
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign='center' sx={{mt: 1}}>
                        <Box border={1} borderRadius={5} sx={{p: 2, mr: 1, borderColor: 'grey.400'}}>
                            신청 대기
                            {member && member.map((el) => ( 
                                el.confirmed === 0 && <Grid 
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
                                        {el.confirmed === 0 && <Button variant='contained' id={el.id} onClick={handleConfirm} size="small" color="blue" sx={{ml: 2}}>수락</Button>}
                                        {el.confirmed === 0 && <Button variant='contained' id={el.id} onClick={handleNonConfirm} size="small" color="red" sx={{ml: 2}}>거절</Button>}
                                        {el.confirmed === 1 && <Button variant='contained' id={el.id} onClick={handleNonConfirm} size="small" color="red" sx={{ml: 2}}>추방</Button>}
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={6} textAlign='center' sx={{mt: 1}}>
                        <Box border={1} borderRadius={5} sx={{p: 2, ml: 1, borderColor: 'grey.400'}}>
                            현재 멤버
                            {member && member.map((el) => ( 
                                el.confirmed === 1 && <Grid 
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
                                        {el.confirmed === 0 && <Button variant='contained' id={el.id} onClick={handleConfirm} size="small" color="blue" sx={{ml: 2}}>수락</Button>}
                                        {el.confirmed === 0 && <Button variant='contained' id={el.id} onClick={handleNonConfirm} size="small" color="red" sx={{ml: 2}}>거절</Button>}
                                        {el.confirmed === 1 && el.hostid !== el.id && <Button variant='contained' id={el.id} onClick={handleNonConfirm} size="small" color="red" sx={{ml: 2}}>추방</Button>}
                                        {el.confirmed === 1 && el.hostid === el.id && <Button variant='contained' disabled size="small" color="red" sx={{ml: 2}}>방장</Button>}
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
                <Button variant='contained' type="submit" color="blue" sx={{mt: 2, ml: 2}}>저장</Button>
            </Container>
    )
}

export default Settings