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

    const textSx = {
        p: 2, 
        mb: 3,
        ml: 25,
        mr: 25,
        backgroundColor: 'blue.dark',
        borderRadius: 5,
        boxShadow: 5,
        color: 'white.main'
      }

    return(
        <div>
            <Grid container textAlign='left' alignItems='center' sx={{ml: 3}}>
                <Grid item xs={12} textAlign='center' sx={{mt: 10}}>
                    <Typography variant="h4" sx={textSx}>
                        내 정보 페이지
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{mt: 10}}>
                        내 아이디  :  {info?.id}
                    </Typography>
                </Grid>
                <Grid item xs={12} >
                    <Typography variant="h5" sx={{mt: 4}}>
                        내 이메일 : {info?.email}
                    </Typography>
                </Grid>
                <Grid item xs={2} sx={{mt: 4}}>
                    <Typography variant="h5">
                        닉네임 : 
                    </Typography>
                </Grid>
                <Grid item xs={10} sx={{mt: 4}}>
                    <TextField value={nickname} size='small' onChange={handleOnchange}/>
                </Grid>
                <Grid item xs={12} textAlign='center' sx={{mt: 15}}>
                    <Button variant="contained" onClick={handleSubmit}> 수정 </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default MyPageInfo