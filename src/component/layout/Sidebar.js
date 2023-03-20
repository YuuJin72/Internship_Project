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

    const textSx = {
        p: 2, 
        mb: 2,
        ml: 3,
        mr: 3,
        backgroundColor: 'blue.dark',
        borderRadius: 5,
        boxShadow: 5,
        color: 'white.main'
      }

    return(
        <div>
            <Container sx={{height: '50em'}}>
                <Grid container>
                    <Grid item xs={12} sx={{pt: 2}}>
                        <Typography onClick={handleMyInfo} variant='h5' sx={textSx} >마이 페이지</Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography onClick={handleMyInfo} variant='h6' sx={{pt: 2, pb: 2}} style={{background: 'radial-gradient(circle, #EEEEEE, #FFFFFF)', cursor: 'pointer'}}>내 정보 보기</Typography>
                    </Grid>
                    <Divider orientation="horizontal" sx={{width: '100%'}}/>
                    <Grid item xs={12}>
                        <Typography onClick={handleMyStudy} variant='h6' sx={{mt: 2, mb: 2}} style={{cursor: 'pointer'}}>내 스터디 보기</Typography>
                    </Grid>
                    <Divider orientation="horizontal" sx={{width: '100%'}}/>
                    <Grid item xs={12}>
                        <Typography onClick={handleChangePw} variant='h6' sx={{pt: 2, pb: 2}}  style={{background: 'radial-gradient(circle, #EEEEEE, #FFFFFF)', cursor: 'pointer'}}>비밀번호 변경</Typography>
                    </Grid>
                </Grid>
                
            </Container>
        </div>
    )
}

export default Sidebar