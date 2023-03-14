import axios from "axios"
import { useEffect, useState } from "react"
import { Typography, TextField, Grid, Button } from "@mui/material"
import { Modal } from "../../modal/Modal"

const MyPageInfo = () => {

    const [info, setInfo] = useState('')
    const [nickname, setNickname] = useState('')

    const { Success, Failure } = Modal()

    const fetchPost = () => {
        axios.get('http://localhost:8080/myinfo')
        .then((res) => {
            setInfo(res.data.result)
            setNickname(res.data.result.nickname)
        })
    }

    const handleOnchange = (e) => {
        setNickname(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8080/myinfo/changenickname`,{
            nickname: nickname
        })
        .then((res) => {
            if(res.data.message === 'success'){
                Success('수정이 완료되었습니다.')
            } else {
                Failure('에러가 발생했습니다.')
            }
        })
    }

    useEffect(() => {
        fetchPost()
    },[])

    return(
        <>
            <Grid container textAlign='left' alignItems='center'>
                <Grid item xs={12}>
                    <Typography>
                        내 정보 페이지
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        내 아이디 : {info?.id}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        내 이메일 : {info?.email}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        닉네임 : 
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField value={nickname} onChange={handleOnchange}/>
                </Grid>
                <Grid item xs={12} textAlign='center'>
                    <Button variant="contained" onClick={handleSubmit}> 수정 </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default MyPageInfo