import './NonMemberPost.css'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, ThemeProvider, Typography, Button, createTheme } from '@mui/material'
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg";
import { Modal } from '../../modal/Modal';
import { memberState } from '../../../store/member';

const NonMemberPost = (props) => {

    const member = useSelector((state) => state.member.value)
    const islogin = useSelector((state => state.user.value))

    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { Warning, Success, Failure } = Modal()

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
          red: {
            main: '#f03e3e',
            contrastText: '#fff',
          },
        },
      });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!islogin){
            Warning('로그인후 이용가능합니다.')
        } else {
            axios.post(`http://localhost:8080/study/requestmember/${params.id}`, {
                status: member
            })
            .then((res) => {
                if(res.data.message === 'request_success'){
                    Success('신청이 완료되었습니다.')
                    dispatch(memberState(true))
                } else if(res.data.message === 'reqcancel_success'){
                    Success('신청이 취소되었습니다.')
                    dispatch(memberState(false))
                } else {
                    Failure('에러가 발생했습니다.')
                }
            })
        }
    }

    const handleCancel = () => {
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
                 {props.prop?.title}
            </Typography>
            <div className='create-background'>
                <div className='create-background-left'>
                    <DefaultImage width='20rem' height='20rem' className="rounded-circle img-thumbnail"/>
                    <p/>
                </div>
                <div className='create-background-right'>
                  <Typography
                  component="h3"
                  variant="h3"
                  align="center"
                  color="text.primary"
                  gutterBottom
                  sx={{
                    mb: '3rem'
                  }}
                >
                  태그 : {props.prop?.tag}
            </Typography><p/>
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
                  방장 : {props.prop?.hostid}
            </Typography><p/>
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
                  스터디 내용
            </Typography><p/>
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
                  {props.prop?.detail}
            </Typography><p/>
                </div> 
                <div>
                  <Box
                  sx={{
                        mt: '35rem',
                      }}>
                    {!member && <Button
                    variant='contained'
                    type='submit'
                    color='darkgreen'
                    sx={{
                        m: '1rem',
                      }}>가입 신청</Button>} 
                    {member && <Button
                    variant='contained'
                    type='submit'
                    color='red'
                    sx={{
                        m: '1rem',
                      }}>신청 중</Button>} 
                    <Button
                    variant='contained'
                    onClick={handleCancel}
                    color='darkgreen'
                    sx={{
                        m: '1rem',
                      }}>목록</Button>
                  </Box>
                </div>
            </div>
          </Box>
            </ThemeProvider>
        </div>
    )
}

export default NonMemberPost