import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal } from '../../modal/Modal';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { loginState } from '../../../store/user';

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

const Signin = () => {
  const { Failure } = Modal();
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;

  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log('handleSubmit')
    axios.post('http://localhost:8080/signin', {
      id: data.get('id'),
      password: data.get('password'),
    })
    .then((response, err) => {
      if(response.data.message === 'fail'){
        Failure('아이디 또는 패스워드가 틀렸습니다.')
      } else if(response.data.message === 'success'){
        dispatch(loginState(true))
        navigate('/')
      } else {
        console.log(response.data)
      }
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        console.log('1')
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      else if (error.request) {
        console.log('2')
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        console.log(error.request);
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  };

  const onClickSignup = () => {
    navigate('/signup')
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'green.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              color='green'
              margin="normal"
              required
              fullWidth
              id="id"
              label="ID"
              name="id"
              autoFocus
            />
            <TextField
              color='green'
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <Button
              color='green'
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
            <Grid container>
              <Grid item xs>
                <Link variant="body2">
                  비밀번호 찾기
                </Link>
              </Grid>
              <Grid item>
                <Link onClick={onClickSignup} variant="body2" curser='pointer'>
                  {"회원이 아니신가요?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Signin;