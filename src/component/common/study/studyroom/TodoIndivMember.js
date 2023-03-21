import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Grid, Typography } from "@mui/material"
import { Modal } from "../../../modal/Modal"
import axios from "axios"

const TodoIndivMember = () => {

    const params = useParams()
    const { Failure } = Modal()
    const [todoMember, setTodoMember] = useState([])

    

    useEffect(() => {
        const fetchPost = () => {
            axios.post(`http://localhost:8080/study/${params.id}/todomember`)
            .then((res) => {
                
                if(res.data.message === 'success'){
                    setTodoMember(res.data.result)
                }
                else{
                    Failure('에러가 발생했습니다.')
                }
            })
        }
        fetchPost()
    }, [setTodoMember])

    const finishSx = {
        backgroundColor: 'green.main',
        borderRadius: 3,
        p: 0.5, 
        ml: 11,
        mr: 11,
    }

    const nonfinishSx = {
        backgroundColor: 'lightgray.main',
        borderRadius: 3,
        p: 0.5, 
        ml: 11,
        mr: 11,
    }

    const textSx = {
        p: 2, 
        mb: 4,
        ml: 18,
        mr: 18,
        backgroundColor: 'blue.dark',
        borderRadius: 5,
        boxShadow: 5,
        color: 'white.main'
      }

    return(
        <>
            <Typography variant="h4" sx={textSx}>
                일일 목표 달성
            </Typography>
            {todoMember && todoMember.map((el) => ( 
                <Grid 
                    key={el?.mem}
                    container sx={{ mt: 1.5 }} 
                    textAlign='center' 
                    borderRadius={3} 
                    height='2rem' 
                    alignItems='center'>
                <Grid key={el?.mem} item xs={6}>
                    {el?.mem}
                </Grid>
                <Grid item xs={6}>
                    {el?.isfinished === 1 
                    ? <Typography sx={finishSx}>
                        완료
                      </Typography>
                    : <Typography sx={nonfinishSx}>
                        미완료
                      </Typography>}
                </Grid>
            </Grid>
            ))}
        </>
    )
}

export default TodoIndivMember