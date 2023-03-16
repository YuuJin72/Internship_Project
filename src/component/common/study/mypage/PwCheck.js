import { useEffect, useState } from "react"
import { Typography, TextField, Box, Button, Grid } from "@mui/material"
import axios from "axios"
import { Modal } from "../../../modal/Modal"

const PwCheck = ({isCorrect, getIsCorrect}) => {

    const { Failure, Warning } = Modal()

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget);
        axios.post(`http://localhost:8080/myinfo/pwcheck`, {
            pw: data.get('password')
        }).then((res) => {
            if(res.data.message === 'success'){
                getIsCorrect(true)
            } else if(res.data.message === 'wrong_pw'){
                Warning('비밀번호가 틀렸습니다.')
            } else{
                Failure('에러가 발생했습니다.')
            }
        })
    }

    return(
        <>
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>
                            비밀번호를 한번 더 입력해주세요
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='비밀번호' name='password' type='password'/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' type='submit'>
                            확인
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default PwCheck