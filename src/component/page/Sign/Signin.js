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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal } from '../../modal/Modal';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { loginState } from '../../../store/user';

const Signin = () => {
  const { Failure } = Modal();
  const navigate = useNavigate()

  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post('http://localhost:8080/signin', {
      id: data.get('id'),
      password: data.get('password'),
    })
    .then((res, err) => {
      if(res.data.message === 'fail'){
        Failure('아이디 또는 패스워드가 틀렸습니다.')
      } else if(res.data.message === 'success'){
        dispatch(loginState(true))
        navigate('/')
      } else {
        console.log(res.data)
      }
    })
    .catch((error) => {
      if (error.res) {
        console.log(error.res.data);
        console.log(error.res.status);
        console.log(error.res.headers);
      }
      else if (error.request) {
        console.log(error.request);
      }
      else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  };

  const onClickSignup = () => {
    navigate('/signup')
  }

  return (
    <Container component="main" maxWidth="xs" sx={{height: '50rem'}}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ mt: 3, bgcolor: 'blue.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mt: 2 }} >
          로그인
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 8 }}>
          <TextField
            color='blue'
            margin="normal"
            required
            fullWidth
            id="id"
            label="ID"
            name="id"
            autoFocus
          />
          <TextField
            color='blue'
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            color='blue'
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 7, mb: 2 }}
          >
            로그인
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item sx={{ mt: 1 }}>
              <Link onClick={onClickSignup} variant="body1" underline="none" style={{cursor: 'pointer', color: '#777777'}}>
                {"회원이 아니신가요?"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Signin;