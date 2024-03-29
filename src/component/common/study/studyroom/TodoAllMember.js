import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Grid, TextField, Typography, Button, Box } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { Modal } from "../../../modal/Modal";

const TodoAllMember = ({scheduleList, getScheduleList}) => {
  const params = useParams()
  // const { Success, Failure } = Modal()
  const [todo, setTodo] = useState('')
  const [objDate, setObjDate] = useState(dayjs())
  const [auth, setAuth] = useState(false)

  const { Failure } = Modal()

  const fetchPost = () => {
      axios.post(`http://localhost:8080/study/${params.id}/todoall`)
      .then((res) => {
        if(res.data.message === 'success'){
          getScheduleList(res.data.result)
          if(res.data.result[0].hostid === res.data.loginid){
            setAuth(true)
          }
        } else if(res.data.message === 'no_result'){
          getScheduleList(res.data.result)
          if(res.data.result[0].hostid === res.data.loginid){
            setAuth(true)
          }
        }
      })
    }
  
    useEffect(() => {
      fetchPost()
    },[])
    const handleChangeTodo = (e) => {
      setTodo(e.target.value)
    }
  
    const handleSubmitTodo = () => {
      axios.post(`http://localhost:8080/study/${params.id}/todoallsubmit`,{
        title: todo,
        date: objDate.format("YYYY-MM-DD")
      })
      .then((res) => {
        if(res.data.message === 'success'){
          fetchPost()
        } else {
          Failure('에러가 발생했습니다.')
        }
      })
    }
  
    const handleDeleteTodo = (e) => {
      axios.post(`http://localhost:8080/study/${params.id}/tododelete`, {
        _id: e.target.id,
      })
      .then((res) => {
        if(res.data.message === 'success'){
          fetchPost()
        } else {
          Failure('에러가 발생했습니다.')
        }
      })
    }

    const textSx = {
      p: 2, 
      mb: 3,
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
              팀 스케줄
            </Typography>
            {auth && 
            <Grid container alignItems='center' sx={{pr: 5}}>
              <Grid item xs={6} sx={{pr: 2}}>
                  <TextField placeholder='할 일을 입력하세요' fullWidth value={todo} onChange={handleChangeTodo} sx={{mt: 2, ml: 2}}/>
              </Grid>
              <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker sx={{mt: 2, pl: 2}}
                      value={objDate}
                      onChange={(newDate) => setObjDate(newDate)}
                      />
                  </LocalizationProvider>
              </Grid>
              <Grid item xs={2}>
                  <Button variant='contained' onClick={handleSubmitTodo} sx={{mt: 2}}> + </Button>
              </Grid>
            </Grid>}
            {scheduleList && !scheduleList[0].noresult && scheduleList.map((el) => (
              <Box key={el._id} boxShadow={3} borderRadius={4} sx={{ml: 3, mr: 5, mb: 1, mt: 2, p: 1}}>
                <Grid container alignItems='center'>
                  <Grid item xs={5}>
                  <Typography key={el._id}> {el?.title} </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{pl: 6}}>
                  <Typography key={el._id}> {el?.start} </Typography>
                  </Grid>
                  <Grid item xs={2}>
                  {auth && <Button variant='contained' id={el._id} onClick={handleDeleteTodo} >삭제</Button>}
                  </Grid>
                </Grid>
              </Box>
            ))}
        </>
    )
}

export default TodoAllMember