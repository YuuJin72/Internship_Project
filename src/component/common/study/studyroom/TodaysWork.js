
import { Box, Button, Checkbox, Grid, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from '../../../modal/Modal';

const TodaysWork = () => {

  const params = useParams()
  const { Success, Warning, Failure } = Modal()
  const [todoList, setTodoList] = useState([]);
  const [todo, setTodo] = useState('')
  const [todoFinished, setTodoFinished] = useState(false)

  const getFormatDate = (date) => {
    let year = date.getFullYear();
    let month = (1 + date.getMonth())
    month = month >= 10 ? month : '0' + month
    let day = date.getDate()
    day = day >= 10 ? day : '0' + day
    return year + '-' + month + '-' + day
}

let today = getFormatDate(new Date())

  const fetchPost = () => {
    setTodoFinished(false)
    axios.post(`http://localhost:8080/study/${params.id}/todoindiv`, {
      date: today
    })
    .then((res) => {
      if(res.data.message === 'success'){
        setTodoList(res.data.result)
        setTodoFinished(!!res.data.result[0]?.isfinished)
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
    axios.post(`http://localhost:8080/study/${params.id}/todosubmit`,{
      date: today,
      title: todo
    })
    .then((res) => {
      if(res.data.message === 'success'){
        fetchPost()
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
      }
    })
  }

  const handleFinishTodo = () => {
    axios.post(`http://localhost:8080/study/${params.id}/todofinish`)
    .then((res) => {
      if(res.data.message === 'success'){
        fetchPost()
        Success('오늘의 공부를 완료하였습니다!')
      } else if(res.data.message === 'no_result'){
        Warning('등록된 할 일이 없습니다.')
      } else {
        Failure('에러가 발생했습니다.')
      }
    })
  }

  const textSx = {
    p: 2, 
    mb: 5,
    ml: 18,
    mr: 18,
    backgroundColor: 'blue.dark',
    borderRadius: 5,
    boxShadow: 5,
    color: 'white.main'
  }

  return (
    <>
        <Typography variant="h4" sx={textSx}>
          개인 스케줄
        </Typography>
      <Grid container alignItems='center'>
        <Grid item xs={10}>
          <TextField placeholder='할 일을 입력하세요' fullWidth value={todo} onChange={handleChangeTodo} />
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' disabled={todoFinished} onClick={handleSubmitTodo}> + </Button>
        </Grid>
      </Grid>
      {todoList && todoList.map((el) => (
        <Box key={el._id} boxShadow={3} borderRadius={4} sx={{ml: 2, mr: 4, mb: 1, mt: 2, p: 1}}>
          <Grid key={el._id} container alignItems='center'>
                <Grid item xs={10}>
                  <Typography> {el?.title} </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Button variant='contained' id={el._id} disabled={todoFinished} onClick={handleDeleteTodo} >삭제</Button>
                </Grid>
          </Grid>
        </Box>
      ))}
      <Grid item xs={12}>
          <Button variant='contained' onClick={handleFinishTodo} disabled={todoFinished} sx={{mt: 25}}> 오늘의 할 일 완료 </Button>
      </Grid>
    </>
  );
}

export default TodaysWork