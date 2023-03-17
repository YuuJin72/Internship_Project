import { Box, Grid, Typography, TextField, Button } from "@mui/material"
import { useState } from "react"
import { Validation } from "../../../page/Sign/Validation"
import axios from "axios"
import { Modal } from "../../../modal/Modal"
const PwChange = () => {

    const { Success, Failure, Warning } = Modal()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(password !== '' && pwState === false && passwordValid === false){
            const data = new FormData(e.currentTarget);
            axios.post(`http://localhost:8080/myinfo/pwchange`, {
                pw: data.get('password')
            }).then((res) => {
                console.log(res.data.message)
                if(res.data.message === 'success'){
                    Success('변경이 완료되었습니다.')
                } else{
                    Failure('에러가 발생했습니다.')
                }
            })
        } else {
            Warning('입력한 비밀번호를 확인해주세요.')
        }
    }

    const [password, setPassword ] = useState('')
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    
    const checkPasswordValid = (input) => {
        return Validation.passwordPattern.test(input);
    };
    const handlePassword = (e) => {
        setPassword(e.target.value)
        setPasswordValid(!checkPasswordValid(e.target.value))
        setPasswordErrorMessage(
        checkPasswordValid(e.target.value) ? '' : '비밀번호는 8자 이상 12자 이하'
        );
    };

    const [password2, setPassword2 ] = useState('')
    const [passwordErrorMessage2, setPasswordErrorMessage2] = useState('');
    const [pwState, setPwState] = useState(false)
    const handlePassword2 = (e) => {
        setPassword2(e.target.value)

        if (password !== password2){
        setPasswordErrorMessage2('비밀번호가 서로 다릅니다.') 
        setPwState(true)
        } else {
        setPasswordErrorMessage2('')
        setPwState(false)
        }
    }

    return(
        <>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ml: 3}}>
                <Grid container>
                    <Grid item xs={12} sx={{mt: 20}}>
                        <Typography>
                            새 비밀번호를 입력해주세요.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{mt: 3}}> 
                        <TextField
                        size="small"
                        required
                        id="password"
                        label="비밀번호"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePassword}
                        error= {passwordValid}
                        helperText={passwordErrorMessage}
                        sx={{width: '25rem'}}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{mt: 2}}>
                        <TextField
                        size="small"
                        required
                        id="password2"
                        value= {password2}
                        label="비밀번호 확인"
                        onChange={handlePassword2}
                        onBlur={handlePassword2}
                        type="password"
                        name="password2"
                        error={pwState}
                        helperText={passwordErrorMessage2}
                        sx={{width: '25rem'}}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{mt: 20}}>
                        <Button variant='contained' type='submit'>
                            확인
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default PwChange