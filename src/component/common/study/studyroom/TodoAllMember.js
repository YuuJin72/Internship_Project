import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Grid, TextField, Typography, Button } from "@mui/material";
import { Modal } from "../../../modal/Modal";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const TodoAllMember = ({scheduleList, getScheduleList}) => {
  const params = useParams()
  // const { Success, Failure } = Modal()
  const [todo, setTodo] = useState('')
  const [objDate, setObjDate] = useState(dayjs())

  const fetchPost = () => {
      axios.post(`http://localhost:8080/study/${params.id}/todoall`)
      .then((res) => {
        if(res.data.message === 'success'){
          getScheduleList(res.data.result)
        } else {
          console.log('err')
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
          console.log('success')
          fetchPost()
        } else {
          console.log('err')
        }
      })
    }
  
    const handleDeleteTodo = (e) => {
      axios.post(`http://localhost:8080/study/${params.id}/tododelete`, {
        _id: e.target.id,
      })
      .then((res) => {
        if(res.data.message === 'success'){
          console.log('success')
          fetchPost()
        } else {
          console.log('err')
        }
      })
    }

    return(
        <>
            전체스케쥴
            {<Grid container alignItems='center'>
              <Grid item xs={6}>
                  <TextField placeholder='할 일을 입력하세요' fullWidth value={todo} onChange={handleChangeTodo} sx={{mt: 2, ml: 2}}/>
              </Grid>
              <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker sx={{mt: 2, ml: 2}}
                      value={objDate}
                      onChange={(newDate) => setObjDate(newDate)}
                      />
                  </LocalizationProvider>
              </Grid>
              <Grid item xs={2}>
                  <Button variant='contained' onClick={handleSubmitTodo} sx={{mt: 2}}> + </Button>
              </Grid>
            </Grid>}
            {scheduleList && scheduleList.map((el) => (
            <Grid key={el?._id} container alignItems='center'>
                    <Grid item xs={5}>
                    <Typography> {el?.title} </Typography>
                    </Grid>
                    <Grid item xs={5}>
                    <Typography> {el?.start} </Typography>
                    </Grid>
                    <Grid item xs={2}>
                    <Button variant='contained' id={el?._id} onClick={handleDeleteTodo} >삭제</Button>
                    </Grid>
            </Grid>
            ))}
        </>
    )
}

export default TodoAllMember