import './StudyCreate.css'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box'

const StudyCreate = () => {

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

    return(
        <div className='create-background-outer'>
          <ThemeProvider theme={theme}>
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
                  스터디 생성
            </Typography>
            <div className='create-background'>
                <div className='create-background-left'>
                    <DefaultImage width='20rem' className="img-thumbnail"/>
                    <p/>
                    <Button
                      color='darkgreen'
                      variant='contained'
                      sx={{
                          m: '1rem',
                        }}>프로필 등록</Button> 
                </div>
                <div className='create-background-right'>
                
                <TextField size='small' fullWidth label="스터디 이름" color="darkgreen" focused margin="normal"/><p/>
                <TextField size='small' fullWidth label="태그" color="darkgreen" focused margin="normal"/><p/>
                <TextField size='small' multiline rows={8} fullWidth label="설명" color="darkgreen" focused margin="normal"/><p/>
                </div> 
                <Box
                sx={{
                      mt: '25rem',
                    }}>
                  <Button
                  variant='contained'
                  color='darkgreen'
                  sx={{
                      m: '1rem',
                    }}>스터디 등록</Button> 
                  <Button
                  variant='contained'
                  color='darkgreen'
                  sx={{
                      m: '1rem',
                    }}>취소</Button>
                </Box>
            </div>
            </ThemeProvider>
        </div>
    )
}

export default StudyCreate