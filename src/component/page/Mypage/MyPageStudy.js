import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Typography, Grid, Box } from "@mui/material"
import { Modal } from "../../modal/Modal"

const MyPageStudy = () => {

    const [mystudy, setMystudy] = useState([])

    const {Success, Failure} = Modal()
    const navigate = useNavigate()

    const fetchPost = () => {
        axios.get('http://localhost:8080/myinfo/mystudy')
        .then((res) => {
            if(res.data.message === 'success'){
                setMystudy(res.data.result)
            } else{
                Failure('오류가 발생했습니다.')
            }
        })
    }

    const handleOnClick = (e) => {
        console.log(e.target.id)
    }

    useEffect(() => {
        fetchPost()
    },[])

    return(
        <>
            <Grid container textAlign='center' alignItems='flex-start' spacing={3}>
                <Grid item xs={6}>
                    <Typography>
                        내 스터디 
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        가입 대기중인 스터디
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                {mystudy && mystudy.map((el) => (
                    el.confirmed === 1 && <Box key={el._num} id={el._num} border={1} onClick={handleOnClick} fullWidth sx={{height: '5rem'}}>
                        <Grid border={1} item xs>
                            <Typography id={el._num}>
                                {el?._num}
                            </Typography>
                        </Grid>
                        <Grid border={1} id={el._num} item xs>
                            <Typography>
                                {el?.title}
                            </Typography>
                        </Grid>
                        <Grid border={1} id={el._num} item xs>
                            <Typography>
                                {el?.hostid}
                            </Typography>
                        </Grid>
                    </Box>
                ))}
                </Grid>
                <Grid item xs={6}>
                {mystudy && mystudy.map((el) => (
                    el.confirmed === 0 && <Box key={el._num} id={el._num} border={1} onClick={handleOnClick} fullWidth sx={{height: '5rem'}}>
                        <Grid border={1} id={el._num} item xs>
                            <Typography>
                                {el?._num}
                            </Typography>
                        </Grid>
                        <Grid border={1} id={el._num} item xs>
                            <Typography>
                                {el?.title}
                            </Typography>
                        </Grid>
                        <Grid border={1} id={el._num} item xs>
                            <Typography>
                                {el?.hostid}
                            </Typography>
                        </Grid>
                    </Box>
                ))}
                </Grid>
            </Grid>
        </>
    )
}

export default MyPageStudy