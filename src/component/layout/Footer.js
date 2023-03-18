import './Footer.css'
import logo from '../../assets/images/Logo.png'
import GitHubIcon from '@mui/icons-material/GitHub';
import { Grid, Typography, Link } from '@mui/material'

export default function Footer(){
    return(
        <div className="footer">
            <Grid container alignItems='center' textAlign='center'>
                <Grid item xs={12} sx={{mt: 2}}>
                    <img src={logo} alt='logo' style={{height: '5rem', width: '8.5rem'}}/>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6' sx={{mt: 2}}>
                        Developer : 정두식
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{mt: 3}}>
                    <Link href="https://github.com/YuuJin72/Internship_Project"  rel="noreferrer" underline="none" color="white.main">
                        <GitHubIcon fontSize='large' />
                    </Link>
                </Grid>
            </Grid>
        </div>
    )
}