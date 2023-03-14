import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { Grid, Container } from '@mui/material';

const MyPageLayout = () => {
    return(
        <Container maxWidth='md' >
            <Grid container textAlign='center'>
                <Grid item xs={3}>
                    <Sidebar /> 
                </Grid>
                <Grid item xs={9}>
                    <Outlet />
                </Grid>
            </Grid>
        </Container>
    )
}

export default MyPageLayout;