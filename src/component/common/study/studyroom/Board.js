import { Button, Container, Typography, Grid, TextField, Box } from "@mui/material"
import { useState, useEffect } from "react"
import { ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate } from "react-router";
import theme from '../../stylecolor/style'
import axios from "axios";
import { Modal } from "../../../modal/Modal";

const Board = () => {

    const [board, setBoard] = useState('')
    const [boardState, setBoardState] = useState(false)
    const [boardList, setBoardList] = useState([])

    const params = useParams()
    const c_Date = new Date()
    const today = c_Date.toLocaleString()
    const navigate = useNavigate()
    const { Success, Failure } = Modal()

    const fetchPost = () => {
        axios.post(`http://localhost:8080/study/${params.id}/board`)
        .then((res) => {
            if(res.data.message === 'success'){
                console.log(res.data.result)
                setBoardList(res.data.result)
            }
        })
    }
    useEffect(() => {
        fetchPost()
    },[setBoardList])

    const handleWrite = () => {
        setBoardState(true)
    }

    const handleBoardChange = (e) => {
        setBoard(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:8080/study/${params.id}/board/submit`,{
            title: board,
            w_date: today
        })
        .then((res) => {
            if(res.data.message === 'success'){
                Success('등록되었습니다.')
                fetchPost()
            }
            else{
                Failure('오류가 발생했습니다.')
            }
        })
    }

    const handleCancel = () => {
        setBoardState(false)
        setBoard('')
    }

    return(
        <ThemeProvider theme={theme}>
            <Container
                maxWidth='md' 
                sx={{
                mt: 5,
                mb: 5,
                }}
            >
                <Grid container sx={{p: 2, m: 1}} justifyContent='flex-end' textAlign='center'>
                    <Grid item xs={12} >
                        <Typography>
                            게시판
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{p: 2, m: 1}}  >
                        <Button variant='contained' onClick={handleWrite}>글 작성</Button>
                    </Grid>
                </Grid>
                {boardState && 
                <Box>
                    <Grid component="form" noValidate onSubmit={handleSubmit} container textAlign='center' alignItems='center' sx={{mb: 10}}>
                        <Grid item xs={10}>
                            <TextField fullWidth value={board} onChange={handleBoardChange}/>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant='contained' type='submit'>등록</Button><p/>
                            <Button variant='contained' onClick={handleCancel}>취소</Button>
                        </Grid>
                    </Grid>
                </Box>}

                {/* map 함수 삽입부분 */}
                {boardList && boardList.map((el) => (
                <Box border={1} key={el?._id}>
                    <Grid container textAlign='center' alignItems='center' sx={{mt: 1}}>
                        <Grid item xs={10}>
                            <Typography textAlign='left' sx={{pl: 2}}>
                                No.{el?._id}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography textAlign='right' sx={{pr: 2}}>
                                {el?.w_date}
                            </Typography>
                        </Grid>
                        <Grid item xs={10} sx={{mt: 2, mb: 2}}>
                            <Typography>
                                {el?.detail}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{mt: 2, mb: 2}}>
                            <Button variant='contained' >수정</Button><p/>
                            <Button variant='contained' >삭제</Button>
                        </Grid>
                    </Grid>
                </Box>))}
                {/* map 함수 삽입부분 끝 */}
            </Container>
        </ThemeProvider>
    )
}

export default Board