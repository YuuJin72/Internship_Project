import './Footer.css'
import logo from '../../assets/images/Logo.png'
import GitHubIcon from '@mui/icons-material/GitHub';
import BuildIcon from '@mui/icons-material/Build';
import { Grid, Typography, Link } from '@mui/material'

export default function Footer(){
    return(
        <div className="footer">
            <Grid container alignItems='center' textAlign='center'>
                <Grid item xs={12} sx={{mt: 2}}>
                    <img src={logo} alt='logo' style={{height: '5rem', width: '8.5rem'}}/>
                </Grid>
                <Grid container alignItems='center' item xs={12} sx={{width: '10rem'}}>
                    <Grid item xs={4} />
                    <Grid item xs={2} textAlign='center'>
                        <Typography variant='h6' sx={{mt: 2}}>
                            Developer
                        </Typography>
                        <Typography variant='h6' sx={{mt: 2}}>
                            <BuildIcon fontSize='medium' sx={{mr: 2}}/>정두식
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='h6' sx={{mt: 2}}>
                            GitHub
                        </Typography>
                        <Link href="https://github.com/YuuJin72/Internship_Project"  rel="noreferrer" underline="none" color="white.main" >
                            <GitHubIcon fontSize='large' sx={{mt: 2}}/>
                        </Link>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Grid>
        </div>
    )
}