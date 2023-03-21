import { Box, Typography, Button, TextField, Slider, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Modal } from '../../modal/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'

const StudyCreate = () => {

  const navigate = useNavigate()
  const { Success, Failure, Warning } = Modal();
  const user = useSelector((state) => state.user.value)
  
  useEffect(() => {
    const isLogin = () => {
      axios.get('http://localhost:8080/islogin')
      .then((res) => {
        if(res.data.message === 'fail'){
          Warning('로그인이 필요한 서비스입니다.')
          navigate('/signin')
        }
      })
    }

    isLogin()
  },[user])
  
  const [titleErrorMessage, setTitleErrorMessage] = useState('')
  const [studyTitleValid, setStudyTitleValid] = useState(false);
  const [studyTitle, setStudyTitle]  = useState('')
  const [memberNum, setMemberNum] = useState(2)

  const handleChangeTitle = (e) => {
    setStudyTitle(e.target.value)
  }

  const handleChangeMember = (e) => {
    setMemberNum(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(studyTitle === ''){
      Warning('제목을 입력해주세요')
      setStudyTitleValid(true)
      setTitleErrorMessage('제목을 입력하세요')
    } else{
      const data = new FormData(e.currentTarget);
      axios.post('http://localhost:8080/study/create', {
        title: data.get('name'),
        tag: data.get('tag'),
        detail: data.get('detail'),
        limit_member: memberNum
      })
      .then((res) => {
        if(res.data.message === 'success'){
          Success('스터디를 생성하였습니다!')
          navigate('/study')
        } else if(res.data.message === 'overlimit'){
          Warning('인원 입력이 잘못되었습니다.')
        } else {
          Failure('생성에 실패하였습니다.')
        }
      })
    }
  }

  const handleCancel = () => {
    Warning('입력이 취소되었습니다.')
    navigate('/study')
  }

  const TextSx = {
    p: 2, 
    mb: 10,
    ml: 18,
    mr: 18,
    backgroundColor: 'blue.dark',
    borderRadius: 5,
    boxShadow: 5,
    color: 'white.main'
  }

  return(
    <div className='bgcolor'>
      <Container maxWidth='lg' align='center' sx={{backgroundColor: 'white.main'}}>
        <Box component="form" noValidate onSubmit={handleSubmit} maxWidth='sm' sx={{pt: 10}}>
          <Typography
            variant="h3"
            sx={[TextSx]}
          >
            스터디 생성
          </Typography>
          <Typography variant="h4">
            스터디 이름
          </Typography>
          <TextField 
            size='small' 
            fullWidth label="스터디 이름" 
            name="name" 
            value = {studyTitle}
            onChange = {handleChangeTitle}
            error = {studyTitleValid}
            color="darkblue" 
            helperText={titleErrorMessage}
            required
            focused 
            margin="normal"
            sx={{mb: 6}}/><p/>
          <Typography  variant="h4">
            태그
          </Typography>
          <TextField 
            size='small' 
            fullWidth 
            label="태그" 
            name="tag" 
            color="darkblue" 
            focused 
            margin="normal"
            sx={{mb: 6}}/><p/>
          <Typography  variant="h4">
            멤버 수 설정 : {memberNum}명
          </Typography>
          <Slider
            aria-label="Temperature"
            defaultValue={2}
            value={memberNum}
            onChange={handleChangeMember}
            valueLabelDisplay="auto"
            step={1}
            min={2}
            max={10}
            sx={{mb: 6}}
          />
          <Typography  variant="h4">
            스터디 소개
          </Typography>
          <TextField 
            size='small' 
            multiline rows={8} 
            fullWidth 
            label="설명" 
            name="detail" 
            color="darkblue" 
            focused 
            margin="normal"/><p/>
          <Box
          sx={{
                mt: '10rem',
                pb: '3rem'
              }}>
            <Button
            variant='contained'
            type='submit'
            color='darkblue'
            sx={{
                m: '1rem',
              }}>스터디 등록</Button> 
            <Button
            variant='contained'
            onClick={handleCancel}
            color='darkblue'
            sx={{
                m: '1rem',
              }}>취소</Button>
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default StudyCreate