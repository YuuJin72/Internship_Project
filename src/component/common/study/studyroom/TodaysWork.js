
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
        setTodoFinished(!!res.data.result[0].isfinished)
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
    axios.post(`http://localhost:8080/study/${params.id}/todosubmit`,{
      date: today,
      title: todo
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
    console.log(e.target.id)
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

  return (
    <>
    <Grid container alignItems='center'>
      <Grid item xs={10}>
        <TextField placeholder='할 일을 입력하세요' fullWidth value={todo} onChange={handleChangeTodo} />
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' disabled={todoFinished} onClick={handleSubmitTodo}> + </Button>
      </Grid>
    </Grid>
    {todoList && todoList.map((el) => (
      <Grid key={el._id} container alignItems='center'>
            <Grid item xs={10}>
              <Typography> {el?.title} </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button variant='contained' id={el._id} disabled={todoFinished} onClick={handleDeleteTodo} >삭제</Button>
            </Grid>
      </Grid>
    ))}
    <Grid item xs={12}>
        <Button variant='contained' onClick={handleFinishTodo} disabled={todoFinished}> 오늘의 할 일 완료 </Button>
    </Grid>

    
    </>
  );
}

export default TodaysWork