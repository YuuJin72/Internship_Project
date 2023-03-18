import './NonMemberPost.css'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, Grid } from '@mui/material'
import { Modal } from '../../modal/Modal';
import { memberState } from '../../../store/member';
import { loginState } from '../../../store/user';
import ImgCreate from '../../../assets/images/StudyCreate.jpg'

const NonMemberPost = (props) => {
    const member = useSelector((state) => state.member.value)
    const islogin = useSelector((state => state.user.value))

    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { Warning, Success, Failure } = Modal()

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!islogin){
            Warning('로그인후 이용가능합니다.')
        } else {
            axios.post(`http://localhost:8080/study/requestmember/${params.id}`, {
                status: member
            })
            .then((res) => {
              if(res.data.message === 'overlimit'){
                Warning('제한 인원수를 초과했습니다.')
              }
              else if(res.data.message === 'request_success'){
                  Success('신청이 완료되었습니다.')
                  dispatch(memberState(true))
              } else if(res.data.message === 'reqcancel_success'){
                  Success('신청이 취소되었습니다.')
                  dispatch(memberState(false))
              } else {
                  Failure('에러가 발생했습니다.')
                  dispatch(loginState(false))
              }
            })
        }
    }

    const handleCancel = () => {
        navigate('/study')
    }

    const TextSx = {
      p: 2, 
      mt: 8,
      mb: 2,
      ml: 18,
      mr: 18,
      backgroundColor: 'blue.dark',
      borderRadius: 5,
      boxShadow: 5,
      color: 'white.main'
    }

    return(
        <div className='create-background-outer'>
          <Container maxWidth='lg'>
            <Paper>
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container alignItems='center' justifyContent='center' textAlign='center'>
                  <Grid item xs={12} sx={{pt: 15, pb: 10}}>
                    <Typography variant='h2'>
                        {props.prop[0]?.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <img src={ImgCreate} alt='img' className="img-thumbnail" style={{width: 500}}/>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid item xs={12}>
                      <Typography variant='h3' sx={TextSx}>
                        태그
                      </Typography>
                      <Typography variant='h4'>
                        {props.prop[0]?.tag}
                      </Typography>
                      <Typography variant='h3' sx={TextSx}>
                            방장
                      </Typography>
                      <Typography variant='h4'>
                        {props.prop[0]?.hostid}
                      </Typography>
                      <Typography variant='h3' sx={TextSx}>
                            현재 인원 
                      </Typography>
                      <Typography variant='h4'>
                        {props.prop[1]?.total} / {props.prop[0]?.limit_member}
                      </Typography>
                      <Typography variant='h3' sx={TextSx}>
                        스터디 소개
                      </Typography>
                      <Typography variant='h5'>
                        {props.prop[0]?.detail}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                      <Box
                      sx={{
                            mt: '15rem',
                            pb: '5rem'
                          }}>
                        {!member && <Button
                        variant='contained'
                        type='submit'
                        color='darkblue'
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
                        color='darkblue'
                        sx={{
                            m: '1rem',
                          }}>목록</Button>
                      </Box>
              </Box>
            </Paper>
          </Container>
        </div>
    )
}

export default NonMemberPost