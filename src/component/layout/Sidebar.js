import { Typography, Grid } from "@mui/material"
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
            <Grid container>
                <Grid item xs={12}>
                    <Typography onClick={handleMyInfo}>내 정보 보기</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography onClick={handleMyStudy}>내 스터디 보기</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography onClick={handleChangePw}>비밀번호 변경</Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default Sidebar