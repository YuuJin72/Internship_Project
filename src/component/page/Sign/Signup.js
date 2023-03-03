import * as React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg";
import { Modal } from '../../modal/Modal'
import axios from 'axios';
import { Validation } from './Validation'
import { chkId } from '../../../store/signup/signid'
import { chkPw } from '../../../store/signup/signpw'
import { chkPwc } from '../../../store/signup/signpwc'
import { chkEmail } from '../../../store/signup/signemail'
import { chkNickname } from '../../../store/signup/signnickname'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

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

const SignUp = () => {
  const { Success, Failure, Warning } = Modal();
  const navigate = useNavigate()
  const idReducer = useSelector((state) => state.id.value)
  const pwReducer = useSelector((state) => state.pw.value)
  const pwcReducer = useSelector((state) => state.pwc.value)
  const emailReducer = useSelector((state) => state.email.value)
  const nicknameReducer = useSelector((state) => state.nickname.value)
  const dispatch = useDispatch()

  const [idInput, setIdInput] = useState('');
  const [idState, setIdState] = useState(false)
  const [idErrorMessage, setIdErrorMessage] = useState('')

  const handleChangeId = (e) => {
    setIdInput(e.target.value);
  }
  // console.log({idReducer}, {pwReducer}, {pwcReducer}, {emailReducer}, {nicknameReducer})
  const onClickIdCheck = () => {
    if(idInput === ''){
      Warning('아이디를 입력해주세요.')
    }
    else{
        axios.post('http://localhost:8080/signup/duplicateId', {
        id: idInput
      })
      .then((res) => {
        if(res.data.message === 'success'){
          Success('사용가능한 아이디입니다.')
          setIdErrorMessage(idErrorMessage => '사용가능한 아이디입니다.')
          setIdState(false)
          dispatch(chkId(true))
        } else if(res.data.message === 'duplicate'){
          Warning('중복된 닉네임입니다.')
          setIdErrorMessage(idErrorMessage => '중복된 아이디입니다.')
          setIdState(true)
          dispatch(chkId(false))
        } else {
          Failure('오류가 발생했습니다.')
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }

  const [password, setPassword ] = useState('')
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  
  const checkPasswordValid = (input) => {
    return Validation.passwordPattern.test(input);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value)
    setPasswordValid(!checkPasswordValid(e.target.value))
    checkPasswordValid(e.target.value)? dispatch(chkPw(true)) : dispatch(chkPw(false))
    setPasswordErrorMessage(
      checkPasswordValid(e.target.value) ? '' : '비밀번호는 8자 이상 12자 이하'
    );
  };

  const [password2, setPassword2 ] = useState('')
  const [passwordErrorMessage2, setPasswordErrorMessage2] = useState('');
  const [pwState, setPwState] = useState(false)
  const handlePassword2 = (e) => {
    setPassword2(e.target.value)

    if (password !== password2){
      setPasswordErrorMessage2('비밀번호가 서로 다릅니다.') 
      setPwState(true)
      dispatch(chkPwc(false))
    } else {
      setPasswordErrorMessage2('')
      setPwState(false)
      dispatch(chkPwc(true))
    }
  }


  const [email, setEmail ] = useState('')
  const [emailValid, setEmailValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  
  const checkemailValid = (input) => {
    return Validation.emailPattern.test(input);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value)
    setEmailValid(!checkemailValid(e.target.value))
    setEmailErrorMessage(
      checkemailValid(e.target.value) ? '' : '이메일 형식이 맞지 않습니다.'
    );
  };
  
  const onClickemailAuth = () => {
    if(email !== '' && emailValid === false){
      axios.post('http://localhost:8080/signup/emailauth', {
        email: email
      })
      .then((res) => {
        if(res.data.message === 'duplicate'){
          Warning('중복된 이메일입니다.')
          dispatch(chkEmail(false))
        } else {
          Success('인증번호가 발송되었습니다.')
          dispatch(chkEmail(true))
        }
      })
    } else {
      Warning('잘못된 이메일입니다.')
    }
  }


  const [nickname, setNickname ] = useState('')
  const [nicknameValid, setNicknameValid] = useState(false);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  
  const checknicknameValid = (input) => {
    return Validation.nicknamePattern.test(input);
  };
  const handleNickname = (e) => {
    setNickname(e.target.value)
    setNicknameValid(!checknicknameValid(e.target.value))
    checknicknameValid(e.target.value)? dispatch(chkNickname(true)) : dispatch(chkNickname(false))
    setNicknameErrorMessage(
      checknicknameValid(e.target.value) ? '' : '닉네임은 2 ~ 8자로 입력해야합니다.'
    );
  };

  const handleUpload = () => {
    console.log('upload')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if(idReducer && pwReducer && pwcReducer && emailReducer && nicknameReducer){
      axios.post('http://localhost:8080/signup', {
        id: data.get('id'),
        password: data.get('password'),
        email: data.get('email'),
        nickname: data.get('nickname'),
        emailnumber: data.get('emailnumber')
      })
      .then((res) => {
        if(res.data.message === 'fail'){
          Failure('오류가 발생했습니다.')
        } else if (res.data.message === 'success') {
          Success('회원가입이 완료되었습니다!')
          navigate('/signin')
        } else {
          Failure('인증번호를 잘못 입력하셨습니다.')
        }
      })
      .catch((error) => {
        console.log(error)
      })
    } else {
      Warning('양식을 다시 확인해주세요')
    }
    
  };
// ============================ 이미지 업로드 부분 ======================================= //
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    if (selectedImage) {
      console.log(selectedImage)
      setImageUrl(URL.createObjectURL(selectedImage));
      axios.post('http://localhost:8080/test', {
        img: selectedImage
      })
      .then((res) => {
        
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }, [selectedImage]);
  // ============================ 이미지 업로드 부분 ======================================= //
  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth='md'>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'darkgreen.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" mt='1rem'>
              회원가입
            </Typography>
 {/* // ============================ 이미지 업로드 부분 ======================================= // */}
            <>
      <input
        accept="image/*"
        type="file"
        id="select-image"
        style={{ display: "none" }}
        onChange={(e) => 
          setSelectedImage(e.target.files[0])}
      />
      <label htmlFor="select-image">
        <Button variant="contained" color="primary" component="span">
          Upload Image
        </Button>
      </label>
      {imageUrl && selectedImage && (
        <Box mt={2} textAlign="center">
          <div>Image Preview:</div>
          <img src={imageUrl} alt={selectedImage.name} height="100px" />
        </Box>
      )}
    </>

    {/* // ============================ 이미지 업로드 부분 ======================================= // */}

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2} item xs={12}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color='green'
                    size="small"
                    name="id"
                    onChange = {handleChangeId}
                    value= {idInput}
                    fullWidth
                    required
                    id="id"
                    label="아이디"
                    error={idState}
                    helperText={idErrorMessage}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                  color='green'
                  variant="contained"
                  onClick={onClickIdCheck}>
                      중복 확인
                  </Button>
                </Grid>
                {/* <p>{errors.nickname?.message}</p> */}
                <Grid item xs={12} mt='1rem'/>
                <Grid item xs={12} sm={6}>
                    <TextField
                      color='green'
                      size="small"
                      required
                      fullWidth
                      id="password"
                      label="비밀번호"
                      type="password"
                      name="password"
                      value={password}
                      onChange={handlePassword}
                      error= {passwordValid}
                      helperText={passwordErrorMessage}
                    />
                </Grid>
                <Grid item xs={12} sm={6} />
                <Grid item xs={12} sm={6}>
                    <TextField
                      color='green'
                      size="small"
                      required
                      fullWidth
                      id="password2"
                      value= {password2}
                      label="비밀번호 확인"
                      onChange={handlePassword2}
                      onBlur={handlePassword2}
                      type="password"
                      name="password2"
                      error={pwState}
                      helperText={passwordErrorMessage2}
                    />
                </Grid>
                <Grid item xs={12} sm={6} />
                <Grid item xs={12} mt='1rem'/>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color='green'
                    size="small"
                    required
                    fullWidth
                    id="email"
                    label="이메일 주소"
                    name="email"
                    value={email}
                    onChange={handleEmail}
                    error= {emailValid}
                    helperText={emailErrorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                  color='green'
                  variant="contained"
                  onClick={onClickemailAuth}>
                      인증번호 받기
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color='green'
                    size="small"
                    required
                    fullWidth
                    name="emailnumber"
                    label="인증번호 입력"
                    id="emailnumber"
                  />
                </Grid>
                <Grid item xs={12} mt='1rem'/>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color='green'
                    size="small"
                    required
                    fullWidth
                    name="nickname"
                    label="닉네임"
                    id="nickname"
                    value={nickname}
                    onChange={handleNickname}
                    error= {nicknameValid}
                    helperText={nicknameErrorMessage}
                  />
                </Grid>
                <Grid item xs={12} mt='1rem'/>
                <Grid item xs={12} sm={4}>
                  <DefaultImage className='img-thumbnail'/>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                  component='label'
                  color='green'
                  variant="contained">
                      프로필 업로드
                      <input hidden accept="image/*" multiple type="file" />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4.5} />
              <Grid item xs={12} sm={6}>
                  <Button
                  color='green'
                  type="submit"
                  variant="contained"
                  sx={{ 
                      mt: 3,
                      mb: 2,
                      minWidth: 200,
                  }}
                  >
                  회원가입
                  </Button>
              </Grid>
              </Grid>
              
              
            </Box>
          </Box>
          <div>
          
          </div>
        </Container>
        
      </ThemeProvider>
    </Container>
  );
}

export default SignUp