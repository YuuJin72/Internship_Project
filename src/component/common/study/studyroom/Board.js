import {
  Button,
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import theme from "../../stylecolor/style";
import axios from "axios";
import { Modal } from "../../../modal/Modal";
import { useSelector } from "react-redux";

const Board = () => {
  const [boardWriter, setBoardWriter] = useState("");
  const [board, setBoard] = useState("");
  const [boardState, setBoardState] = useState(false);
  const [boardList, setBoardList] = useState([]);

  const [boardEditState, setBoardEditState] = useState(false);
  const [boardNumber, setBoardNumber] = useState(0);
  const [boardEdit, setBoardEdit] = useState("");

  const params = useParams();
  const c_Date = new Date();
  const today = c_Date.toLocaleString();
  const navigate = useNavigate();
  const { Success, Failure } = Modal();

  const host = useSelector((state) => state.studyroomhost.value);

  const fetchPost = () => {
    axios.post(`http://localhost:8080/study/${params.id}/board`).then((res) => {
      if (res.data.message === "success") {
        setBoardList(res.data.result);
        setBoardWriter(res.data.writer);
      }
    });
  };
  useEffect(() => {
    fetchPost();
  }, [setBoardList]);

  const handleWrite = () => {
    setBoardState(true);
  };

  const handleBoardChange = (e) => {
    setBoard(e.target.value);
  };

  // 게시글 등록
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8080/study/${params.id}/board/submit`, {
        title: board,
        w_date: today,
      })
      .then((res) => {
        if (res.data.message === "success") {
          Success("등록되었습니다.");
          setBoardState(false);
          setBoard("");
          fetchPost();
        } else {
          Failure("오류가 발생했습니다.");
        }
      });
  };

  // 게시글 등록 취소
  const handleCancel = () => {
    setBoardState(false);
    setBoard("");
  };

  // 등록된 게시물 수정 파트
  useEffect(() => {}, [boardEditState]);

  const handleEdit = (e) => {
    setBoardEdit("");
    axios
      .post(`http://localhost:8080/study/${params.id}/board/editstart`, {
        boardId: e.target.id,
      })
      .then((res) => {
        setBoardEdit(res.data.detail);
        setBoardEditState(true);
        setBoardNumber(res.data._id);
      });
  };

  const handBoardEditChange = (e) => {
    setBoardEdit(e.target.value);
  };

  // 게시물 수정 완료 파트
  const handleEditComplete = (e) => {
    axios
      .post(`http://localhost:8080/study/${params.id}/board/editend`, {
        detail: boardEdit,
        boardId: e.target.id,
      })
      .then((res) => {
        if (res.data.message === "success") {
          Success("수정이 완료되었습니다.");
          fetchPost();
          setBoardEdit("");
          setBoardEditState(false);
        } else {
          Failure("에러가 발생했습니다.");
        }
      });
  };

  // 게시물 삭제 파트
  const handleDelete = (e) => {
    axios
      .post(`http://localhost:8080/study/${params.id}/board/postdelete`, {
        boardId: e.target.id,
      })
      .then((res) => {
        if (res.data.message === "success") {
          Success("삭제가 완료되었습니다.");
          fetchPost();
        } else {
          Failure("에러가 발생했습니다.");
        }
      });
  };

  const handleEditCancel = (e) => {
    setBoardEditState(false);
    setBoardEdit("");
  };

  const textSx = {
    p: 2,
    mb: 4,
    ml: 50,
    mr: 50,
    backgroundColor: "blue.dark",
    borderRadius: 5,
    boxShadow: 5,
    color: "white.main",
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        pb: 4,
      }}
    >
      <Paper
        sx={{
          mt: 4,
          pt: 5,
          pb: 4,
          backgroundColor: "white.main",
        }}
      >
        <Grid
          container
          sx={{ p: 2, m: 1 }}
          justifyContent="flex-end"
          textAlign="center"
        >
          <Grid item xs={12}>
            <Typography variant="h4" sx={textSx}>
              게시판
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ p: 2, m: 1 }}>
            <Button variant="contained" onClick={handleWrite}>
              글 작성
            </Button>
          </Grid>
        </Grid>
        {boardState && (
          <Box
            boxShadow={3}
            borderRadius={4}
            sx={{ ml: 3, mr: 3, mb: 5, p: 2 }}
          >
            <Grid
              component="form"
              noValidate
              onSubmit={handleSubmit}
              container
              textAlign="center"
              alignItems="center"
              sx={{ p: 2 }}
            >
              <Grid item xs={10} sx={{ p: 1 }}>
                <TextField
                  fullWidth
                  value={board}
                  onChange={handleBoardChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ p: 1 }}>
                <Button variant="contained" type="submit">
                  등록
                </Button>
                <p />
                <Button variant="contained" onClick={handleCancel}>
                  취소
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {boardList &&
          boardList.map((el) => (
            <Box
              boxShadow={3}
              borderRadius={4}
              key={el?._id}
              sx={{ ml: 3, mr: 3, mb: 1, p: 1 }}
            >
              <Grid
                container
                textAlign="center"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Grid item xs={4}>
                  <Typography textAlign="left" sx={{ pl: 2 }}>
                    No.{el?._id}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography textAlign="center" sx={{ pr: 2 }}>
                    작성자 : {el?.id}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography textAlign="right" sx={{ pr: 2 }}>
                    {el?.w_date}
                  </Typography>
                </Grid>
                <Grid item xs={10} sx={{ mt: 2, mb: 2 }}>
                  {(!boardEditState || el._id !== boardNumber) && (
                    <Typography>{el?.detail}</Typography>
                  )}
                  {boardEditState &&
                    (el.id === boardWriter || boardWriter === host) &&
                    el._id === boardNumber && (
                      <TextField
                        fullWidth
                        value={boardEdit}
                        onChange={handBoardEditChange}
                      />
                    )}
                </Grid>
                <Grid item xs={2} sx={{ mt: 2, mb: 2 }}>
                  {!boardEditState &&
                    (el.id === boardWriter || boardWriter === host) && (
                      <Button
                        variant="contained"
                        id={el?._id}
                        onClick={handleEdit}
                      >
                        수정
                      </Button>
                    )}
                  {boardEditState &&
                    (el.id === boardWriter || boardWriter === host) &&
                    el._id === boardNumber && (
                      <Button
                        variant="contained"
                        id={el?._id}
                        onClick={handleEditComplete}
                      >
                        완료
                      </Button>
                    )}
                  <p />
                  {!boardEditState &&
                    (el.id === boardWriter || boardWriter === host) && (
                      <Button
                        variant="contained"
                        id={el?._id}
                        onClick={handleDelete}
                      >
                        삭제
                      </Button>
                    )}
                  {boardEditState &&
                    (el.id === boardWriter || boardWriter === host) &&
                    el._id === boardNumber && (
                      <Button
                        variant="contained"
                        id={el?._id}
                        onClick={handleEditCancel}
                      >
                        취소
                      </Button>
                    )}
                </Grid>
              </Grid>
            </Box>
          ))}
        {!boardList && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ mt: 10 }}>
              게시글이 아직 없습니다.
            </Typography>
            <Typography variant="h5" sx={{ mt: 7, mb: 25 }}>
              이 방의 첫 게시글을 남겨보세요!
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Board;
