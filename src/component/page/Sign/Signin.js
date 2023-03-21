import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "../../modal/Modal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loginState } from "../../../store/user";
import { nicknameState } from "../../../store/getnickname.js";

const Signin = () => {
  const { Failure } = Modal();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .post("http://localhost:8080/signin", {
        id: data.get("id"),
        password: data.get("password"),
      })
      .then((res, err) => {
        if (res.data.message === "fail") {
          Failure("아이디 또는 패스워드가 틀렸습니다.");
        } else if (res.data.message === "success") {
          dispatch(loginState(true));
          dispatch(nicknameState(res.data.nickname));
          navigate("/");
        } else {
          Failure("에러가 발생했습니다.");
        }
      })
      .catch((error) => {
        Failure("에러가 발생했습니다.");
      });
  };

  const onClickSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="bgcolor">
      <Container
        component="main"
        maxWidth="md"
        sx={{ height: "50rem", bgcolor: "white.main" }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ mt: 15, bgcolor: "darkblue.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            로그인
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 8 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="ID"
              name="id"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 7, mb: 2 }}
            >
              로그인
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item sx={{ mt: 1 }}>
                <Link
                  onClick={onClickSignup}
                  variant="body1"
                  underline="none"
                  style={{ cursor: "pointer", color: "#777777" }}
                >
                  {"회원이 아니신가요?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Signin;
