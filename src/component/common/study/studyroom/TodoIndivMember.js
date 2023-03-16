import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Grid } from "@mui/material"
import axios from "axios"

const TodoIndivMember = () => {

    const params = useParams()

    const [todoMember, setTodoMember] = useState([])

    

    useEffect(() => {
        const fetchPost = () => {
            axios.post(`http://localhost:8080/study/${params.id}/todomember`)
            .then((res) => {
                
                if(res.data.message === 'success'){
                    setTodoMember(res.data.result)
                }
                else{
                    console.log('err')
                }
            })
        }
        fetchPost()
    }, [todoMember])

    return(
        <>
            {todoMember && todoMember.map((el) => ( 
                <Grid 
                    key={el?.id}
                    container sx={{ mt: 1 }} 
                    textAlign='center' 
                    borderRadius={3} 
                    height='2rem' 
                    alignItems='center'>
                <Grid key={el?.id} item xs={6}>
                    {el?.mem}
                </Grid>
                <Grid item xs={6}>
                    {el?.isfinished === 1 ? '완료' : '미완료'}
                </Grid>
            </Grid>
            ))}
        </>
    )
}

export default TodoIndivMember