import * as React from 'react';
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

export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2} item xs={12}>
              <Grid item xs={12} sm={6}>
                <TextField
                  color='green'
                  size="small"
                  autoComplete="given-name"
                  name="id"
                  fullWidth
                  required
                  id="id"
                  label="아이디"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                color='green'
                variant="contained">
                    중복 확인
                </Button>
              </Grid>
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
                  label="비밀번호 확인"
                  type="password"
                  name="password2"
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                color='green'
                variant="contained">
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
                />
              </Grid>
              <Grid item xs={12} mt='1rem'/>
              <Grid item xs={12} sm={4}>
                <DefaultImage className='img-thumbnail'/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                color='green'
                variant="contained">
                    프로필 업로드
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
  );
}