import { Typography, Grid, Container, Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"

const Sidebar = () => {

    const navigate = useNavigate()

    const handleMyInfo = () => {
        navigate('/mypage')
    }

    const handleMyStudy = () => {
        navigate('/mypage/mystudy')
    }

    const handleChangePw = () => {
        navigate('/mypage/changepw')
    }

    return(
        <div className="sidebar">
            <Container sx={{height: '50em'}}>
                
                <Grid container>
                    <Grid item xs={12}>
                        <Typography onClick={handleMyInfo} variant='h4' sx={{mt: 5, mb: 5}}>마이 페이지</Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography onClick={handleMyInfo} variant='h6' sx={{mt: 2, mb: 2}}>내 정보 보기</Typography>
                    </Grid>
                    <Divider orientation="horizontal" sx={{width: '100%'}}/>
                    <Grid item xs={12}>
                        <Typography onClick={handleMyStudy} variant='h6' sx={{mt: 2, mb: 2}}>내 스터디 보기</Typography>
                    </Grid>
                    <Divider orientation="horizontal" sx={{width: '100%'}}/>
                    <Grid item xs={12}>
                        <Typography onClick={handleChangePw} variant='h6' sx={{mt: 2, mb: 2}}>비밀번호 변경</Typography>
                    </Grid>
                </Grid>
                
            </Container>
        </div>
    )
}

export default Sidebar