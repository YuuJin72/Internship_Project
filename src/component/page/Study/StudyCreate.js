import './StudyCreate.css'
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Modal } from '../../modal/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { Validation } from '../Sign/Validation'

const StudyCreate = () => {

    const theme = createTheme({
      palette: {
        green: {
          main: '#51cf66',
          contrastText: '#fff',
        },
        darkgreen: {
          main: '#2f9e44',
          contrastText: '#fff',
        },
      },
    });

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
      console.log('useEffect')
      isLogin()
    },[user])
    
    const [titleErrorMessage, setTitleErrorMessage] = useState('')
    const [studyTitleValid, setStudyTitleValid] = useState(false);
    const [studyTitle, setStudyTitle]  = useState('')

    const [limitMemberErrorMessage, setLimitMemberErrorMessage] = useState('')
    const [limitMemberValid, setLimitMemberValid] = useState(false);
    const [limitMember, setLimitMember]  = useState('')

    const handleChangeTitle = (e) => {
      setStudyTitle(e.target.value)
    }

    const checkLimitMemberValid = (input) => {
      return Validation.memberPattern.test(input);
    };

    const handleChangeLimitMember = (e) => {
      setLimitMember(e.target.value)
      setLimitMemberValid(!checkLimitMemberValid(e.target.value))
      checkLimitMemberValid(e.target.value)? setLimitMemberValid(true) : setLimitMemberValid(false)
      setLimitMemberErrorMessage(
        checkLimitMemberValid(e.target.value) ? '' : '숫자만 입력가능합니다.'
      );
    }

    const handleSubmit = (e) => {
      console.log(limitMemberValid)
      e.preventDefault();
      if(studyTitle === ''){
        Warning('제목을 입력해주세요')
        setStudyTitleValid(true)
        setTitleErrorMessage('제목을 입력하세요')
      } else if(!setLimitMemberValid){
        Warning('인원 입력이 잘못되었습니다.')
      } else{
        const data = new FormData(e.currentTarget);
        axios.post('http://localhost:8080/study/create', {
          title: data.get('name'),
          tag: data.get('tag'),
          detail: data.get('detail'),
          limit_member: data.get('limitMember')
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

    return(
        <div className='create-background-outer'>
          <ThemeProvider theme={theme}>
          <Box component="form" noValidate onSubmit={handleSubmit}>

            <Typography
                  component="h3"
                  variant="h3"
                  align="center"
                  color="text.primary"
                  gutterBottom
                  sx={{
                    mt: '3rem',
                    mb: '3rem'
                  }}
                >
                  스터디 생성
            </Typography>
            <div className='create-background'>
                <div className='create-background-left'>
                    <DefaultImage width='20rem' className="img-thumbnail"/>
                    <p/>
                    <Button
                      color='darkgreen'
                      variant='contained'
                      sx={{
                          m: '1rem',
                        }}>프로필 등록</Button> 
                </div>
                <div className='create-background-right'>
                  <TextField 
                    size='small' 
                    fullWidth label="스터디 이름" 
                    name="name" 
                    value = {studyTitle}
                    onChange = {handleChangeTitle}
                    error = {studyTitleValid}
                    color="darkgreen" 
                    helperText={titleErrorMessage}
                    focused 
                    margin="normal"/><p/>
                  <TextField 
                    size='small' 
                    fullWidth 
                    label="태그" 
                    name="tag" 
                    color="darkgreen" 
                    focused 
                    margin="normal"/><p/>
                    <TextField 
                    size='small' 
                    fullWidth 
                    label="최대 인원 (2 ~ 10명)" 
                    name="limitMember"
                    value={limitMember}
                    onChange={handleChangeLimitMember}
                    error={!limitMemberValid}
                    helperText={limitMemberErrorMessage} 
                    color="darkgreen" 
                    focused 
                    margin="normal"/><p/>
                  <TextField 
                    size='small' 
                    multiline rows={8} 
                    fullWidth 
                    label="설명" 
                    name="detail" 
                    color="darkgreen" 
                    focused 
                    margin="normal"/><p/>
                </div> 
                <div>
                  <Box
                  sx={{
                        mt: '35rem',
                      }}>
                    <Button
                    variant='contained'
                    type='submit'
                    color='darkgreen'
                    sx={{
                        m: '1rem',
                      }}>스터디 등록</Button> 
                    <Button
                    variant='contained'
                    onClick={handleCancel}
                    color='darkgreen'
                    sx={{
                        m: '1rem',
                      }}>취소</Button>
                  </Box>
                </div>
            </div>
          </Box>
            </ThemeProvider>
        </div>
    )
}

export default StudyCreate