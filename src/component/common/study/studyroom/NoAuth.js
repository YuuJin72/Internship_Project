import { Container, Paper, Typography } from "@mui/material";
import WarningImg from "../../../../assets/images/Warning.png";

const NoAuth = () => {
  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", mt: 4, pb: 4 }}>
      <Paper
        sx={{
          width: "100%",
          height: "50rem",
          pt: 15,
          pb: 4,
          backgroundColor: "white.main",
        }}
      >
        <img
          src={WarningImg}
          alt="img"
          style={{ width: "22rem", height: "17rem", marginTop: "1rem" }}
        />
        <Typography variant="h2" sx={{ pt: 15 }}>
          권한이 없습니다.
        </Typography>
      </Paper>
    </Container>
  );
};

export default NoAuth;
