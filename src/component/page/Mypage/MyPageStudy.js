import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Typography, Grid, Box, Pagination, Stack, Button } from "@mui/material"
import { Modal } from "../../modal/Modal"
import { shadows } from "@mui/system"

const MyPageStudy = () => {

    const [mystudy, setMystudy] = useState([])
    const [paginationNum, setPaginationNum] = useState(0)
    const {Success, Failure} = Modal()
    const navigate = useNavigate()

    const fetchPost = () => {
        axios.post('http://localhost:8080/myinfo/mystudy')
        .then((res) => {
            if(res.data.message === 'success'){
                setMystudy(res.data.result)
            } else{
                Failure('오류가 발생했습니다.')
            }
        })
    }

    const handleOnClick = (e) => {
        const target = e.target.id
        target !== '' && navigate(`/study/${target}`)
    }

    useEffect(() => {
        fetchPost()
    },[])

    const textSx = {
        p: 2, 
        mb: 3,
        ml: 30,
        mr: 40,
        backgroundColor: 'blue.dark',
        borderRadius: 5,
        boxShadow: 5,
        color: 'white.main'
      }

    return(
        <>
            <Grid container textAlign='center' spacing={3} justifyItems='center' sx={{ml: 3, mb: 20}}>
                <Grid item xs={12} sx={{mt: 10}}>
                    <Typography variant="h5" sx={textSx}>
                        내 스터디 
                    </Typography>
                </Grid>
                <Grid item xs={12} >
                {mystudy && mystudy.map((el) => (
                    el.confirmed === 1 && <Box key={el._num} id={el._num} borderRadius={5} boxShadow={5} backgroundColor='blue.main' color='white.main' onClick={handleOnClick} sx={{height: '5rem', mt: 1.5, mr: 10}}>
                        <Grid container alignItems='center' sx={{height: '5rem'}}>
                            <Grid item xs={2}>
                                <Typography id={el._num}>
                                    {el?._num}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography id={el._num}>
                                    {el?.title}
                                </Typography >
                            </Grid>
                            <Grid item xs={2}>
                                <Typography id={el._num}>
                                    방장 : {el?.hostid}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                </Grid>
                <Grid item xs={12} sx={{mt: 10}}>
                    <Typography variant="h5" sx={textSx}>
                        가입 대기중인 스터디
                    </Typography>
                </Grid>
                <Grid item xs={12} >
                {mystudy && mystudy.map((el) => (
                    el.confirmed === 0 && <Box key={el._num} id={el._num} borderRadius={5} boxShadow={5} backgroundColor='blue.main' color='white.main' onClick={handleOnClick} sx={{height: '5rem', mt: 1.5, mr: 10}}>
                        <Grid container alignItems='center' sx={{height: '5rem'}}>
                            <Grid item xs={2} >
                                <Typography id={el._num}>
                                    {el?._num}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography id={el._num}>
                                    {el?.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} >
                                <Typography id={el._num}>
                                방장 : {el?.hostid}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                </Grid>
            </Grid>
        </>
    )
}

export default MyPageStudy